import type { NextApiRequest, NextApiResponse } from 'next'
import { SupplierContract } from '@/app/[tenantId]/(main)/supplier-contract/supplier-contract-types'

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<SupplierContract>
) {
  if (req.method === 'POST') {
    // Mock response for demo
    const mockContract: SupplierContract = {
      id: Math.floor(Math.random() * 1000),
      ...req.body,
      SupplierName: "Mock Tedarikçi Ltd. Şti.",
      Created_at: new Date().toISOString(),
      UpdatedAt: new Date().toISOString(),
      Created_by_id: 1,
      CreatedUserName: "Test User",
      Assigned_to_id: 1,
      Assigned_to_Name: "Test Manager"
    }
    
    res.status(200).json(mockContract)
  } else {
    res.setHeader('Allow', ['POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
