import { NextApiRequest, NextApiResponse } from 'next';
import { Dataset } from '@/lib/dataset';
import { jwtVerify } from 'jose';
import { extractTenantId } from '@/lib/utils';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    try {
        const tenantId = extractTenantId(req.headers.referer);
        const ACCESS_TOKEN_SECRET = new TextEncoder().encode(process.env.ACCESS_TOKEN_SECRET);

        const cookies = req.headers.cookie?.split(';').reduce((acc: { [key: string]: string }, cookie) => {
            const [key, value] = cookie.trim().split('=');
            if (key && value) {
                acc[key.trim()] = decodeURIComponent(value.trim());
            }
            return acc;
        }, {}) || {};

        if (cookies) {
            let userId = "";
            if(process.env.IS_BOLT?.toString() == "1"){
                userId = "1";
            }else{
                const accessToken = (process.env.IS_BOLT?.toString() == "1" ? new TextEncoder().encode(process.env.BOLTACCESSTOKEN) : cookies[`${tenantId}_access_token`]) ?? "";
                const decoded = await jwtVerify(
                    accessToken,
                    ACCESS_TOKEN_SECRET
                );
                userId = decoded.payload.userId?.toString() || "";
            }

            if (!userId) {
                return res.status(400).json({ error: 'No userId found in token' });
            }

            const instance = Dataset.getInstance();

            // Handle different HTTP methods
            switch (req.method) {
                case 'GET':
                    interface ContractResult {
                        id: number;
                        contractNumber: string;
                        BranchID: number;
                        BranchName: string;
                        Status: string;
                        [key: string]: any;
                    }

                    const query = `
                        SELECT c.*, b.BranchName,
                               cu.UserName as CreatedUserName,
                               au.UserName as Assigned_to_Name
                        FROM Contracts c
                        LEFT JOIN Efr_Branchs b ON c.BranchID = b.BranchID
                        LEFT JOIN Efr_Users cu ON c.Created_by_id = cu.UserID
                        LEFT JOIN Efr_Users au ON c.Assigned_to_id = au.UserID
                        WHERE EXISTS (
                            SELECT 1 
                            FROM Efr_Users u 
                            WHERE u.UserID = @userId
                            AND u.IsActive = 1 
                            AND (u.Category = 5 OR CHARINDEX(',' + CAST(b.BranchID AS VARCHAR) + ',', ',' + u.UserBranchs + ',') > 0)
                        )
                    `;
                    
                    const result = await instance.executeQuery<ContractResult[]>({
                        query,
                        parameters: {
                            userId
                        },
                        req
                    });

                    if (!result || result.length === 0) {
                        return res.status(404).json({ error: 'No contracts found' });
                    }
                    return res.status(200).json(result);

                case 'POST':
                    // Handle contract creation
                    const newContract = req.body;
                    const insertQuery = `
                        INSERT INTO Contracts (
                            contractNumber, BranchID, Status, startDate, endDate,
                            franchiseType, royaltyPercentage, initialFee, monthlyFee,
                            securityDeposit, equipmentFee, trainingFee, marketingFee,
                            territory, renewalTerms, terminationTerms,
                            Created_by_id, Assigned_to_id, Created_at
                        ) VALUES (
                            @contractNumber, @BranchID, @Status, @startDate, @endDate,
                            @franchiseType, @royaltyPercentage, @initialFee, @monthlyFee,
                            @securityDeposit, @equipmentFee, @trainingFee, @marketingFee,
                            @territory, @renewalTerms, @terminationTerms,
                            @Created_by_id, @Assigned_to_id, GETDATE()
                        )
                    `;
                    
                    await instance.executeQuery({
                        query: insertQuery,
                        parameters: {
                            ...newContract,
                            Created_by_id: userId
                        },
                        req
                    });
                    
                    return res.status(201).json({ message: 'Contract created successfully' });

                case 'PUT':
                    // Handle contract update
                    const { id, ...updateData } = req.body;
                    const updateQuery = `
                        UPDATE Contracts
                        SET 
                            Status = @Status,
                            startDate = @startDate,
                            endDate = @endDate,
                            franchiseType = @franchiseType,
                            royaltyPercentage = @royaltyPercentage,
                            initialFee = @initialFee,
                            monthlyFee = @monthlyFee,
                            securityDeposit = @securityDeposit,
                            equipmentFee = @equipmentFee,
                            trainingFee = @trainingFee,
                            marketingFee = @marketingFee,
                            territory = @territory,
                            renewalTerms = @renewalTerms,
                            terminationTerms = @terminationTerms,
                            Assigned_to_id = @Assigned_to_id,
                            UpdatedAt = GETDATE()
                        WHERE id = @id
                    `;
                    
                    await instance.executeQuery({
                        query: updateQuery,
                        parameters: {
                            id,
                            ...updateData
                        },
                        req
                    });
                    
                    return res.status(200).json({ message: 'Contract updated successfully' });

                default:
                    return res.status(405).json({ error: 'Method not allowed' });
            }
        }

        return res.status(400).json({ error: 'Invalid request' });

    } catch (error: any) {
        console.error('Error in contract handler:', error);
        return res.status(500).json({
            error: 'Internal server error',
            details: error.message
        });
    }
}
