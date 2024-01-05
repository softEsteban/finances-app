import { NextApiRequest, NextApiResponse } from "next";
import Transactions from "../models/transaction";
import Accounts from "../models/account";
import Subcategories from "@/models/subcategory";
import Users from "@/models/user";
import ExcelJS from 'exceljs';

const TransactionTypes = {
    INCOME: 'income',
    OUTCOME: 'outcome'
};

// GET - http://localhost:3000/api/transactions?userId=anyuserid&limit=10&type=income
export async function getTransactions(
    userId: any,
    limit: any,
    type: any,
    req: NextApiRequest,
    res: NextApiResponse
) {
    try {
        const params = { userId, limit, type };
        const transactionQuery = await buildTransactionsQuery(params);
        const transactions = await transactionQuery;

        if (!transactions || transactions.length === 0) {
            return res.status(404).json({ error: 'Transactions not found' });
        }

        res.status(200).json(transactions);
    } catch (error) {
        console.error('Error while fetching transactions:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function buildTransactionsQuery(params: { userId?: any; limit?: any; type?: any }): Promise<any> {
    let query = Transactions.find()
        .populate('subcategoryId', 'name', Subcategories)
        .populate('userId', 'name email', Users)
        .populate('accountId', 'name', Accounts)
        .sort({ date: -1, createdAt: -1 });

    if (params.userId && params.type) {
        query = query.find({ userId: params.userId, type: params.type });
    }

    if (params.limit) {
        query = query.limit(parseInt(params.limit, 10));
    }

    return query;
}

// GET - http://localhost:3000/api/transactions/:transactionId
export async function getTransactionById(transactionId: string, req: NextApiRequest, res: NextApiResponse) {
    try {
        const transaction = await Transactions.findById(transactionId)
            .populate("subcategoryId", "name", Subcategories)
            .populate("userId", "name email", Users)
            .populate("accountId", "name", Accounts);

        if (!transaction) {
            return res.status(404).json({ error: "Transaction not found" });
        }

        res.status(200).json(transaction);
    } catch (error) {
        console.error('Error while fetching transaction:', error);
        res.status(500).json({ error: "Internal server error" });
    }
}

// POST - http://localhost:3000/api/transactions
export async function createTransaction(req: NextApiRequest, res: NextApiResponse) {
    try {
        // Extract necessary data from the request body
        const { userId, type, amount, subcategoryId, description, date, accountId } = req.body;

        // Create a new transaction object
        const newTransactionData: {
            userId: string;
            type: string;
            amount: number;
            subcategoryId: string;
            description: string;
            date: Date;
            accountId: string;
            createdAt: Date;
        } = {
            userId,
            type,
            amount,
            subcategoryId,
            description,
            date,
            accountId,
            createdAt: new Date()
        };

        const newTransaction = new Transactions(newTransactionData);
        const savedTransaction = await newTransaction.save();

        // Update account balance
        const targetAccount = await Accounts.findById(accountId);
        if (targetAccount) {
            if (type === TransactionTypes.INCOME) {
                targetAccount.amount += amount;
                await targetAccount.save();
            } else {
                targetAccount.amount -= amount;
                await targetAccount.save();
            }
        }

        return res.status(201).json(savedTransaction);

    } catch (error) {
        console.error('Error while creating transaction:', error);
        res.status(500).json({ error: "Internal server error" });
    }
}

// PUT - http://localhost:3000/api/transactions/:transactionId
export async function updateTransaction(transactionId: string, req: NextApiRequest, res: NextApiResponse) {
    try {
        const { userId, type, amount, subcategoryId, description, date, source } = req.body;

        const updatedTransactionData: {
            userId: string;
            type: string;
            amount: number;
            subcategoryId: string;
            description: string;
            date: Date;
            source?: string | undefined;
            updatedAt: Date;
        } = {
            userId,
            type,
            amount,
            subcategoryId,
            description,
            date,
            updatedAt: new Date()
        };

        const updatedTransaction = await Transactions.findByIdAndUpdate(
            transactionId,
            updatedTransactionData,
            { new: true }
        );

        if (!updatedTransaction) {
            return res.status(404).json({ error: "Transaction not found" });
        }

        res.status(200).json(updatedTransaction);
    } catch (error) {
        console.error('Error while updating transaction:', error);
        res.status(500).json({ error: "Internal server error" });
    }
}

// DELETE - http://localhost:3000/api/transactions/:transactionId
export async function deleteTransaction(transactionId: string, req: NextApiRequest, res: NextApiResponse) {
    try {
        const deletedTransaction = await Transactions.findByIdAndDelete(transactionId);

        if (!deletedTransaction) {
            return res.status(404).json({ error: "Transaction not found" });
        }

        res.status(200).json({ message: "Transaction deleted successfully" });
    } catch (error) {
        console.error('Error while deleting transaction:', error);
        res.status(500).json({ error: "Internal server error" });
    }
}

// GET - http://localhost:3000/api/transactions/getTransactionsExcel?userId=6584ee6676ffcd007861b968
export async function getTransactionsExcelByUser(userId: any, req: NextApiRequest, res: NextApiResponse) {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Data');

    // Get user transactions data
    const transactions = await Transactions.find({ userId })
        .populate('subcategoryId', 'name', Subcategories)
        .populate('userId', 'name email', Users)
        .populate('source', 'description', Transactions)
        .sort({ date: -1, createdAt: -1 });

    // Add data to the worksheet (example)
    worksheet.columns = [
        { header: 'Id', key: 'id', width: 25 },
        { header: 'User id', key: 'userId', width: 25 },
        { header: 'User name', key: 'userName', width: 10 },
        { header: 'Type', key: 'type', width: 10 },
        { header: 'Amout', key: 'amount', width: 10 },
        { header: 'Subcategory', key: 'subcategory', width: 25 },
        { header: 'Description', key: 'description', width: 40 },
        { header: 'Date', key: 'date', width: 15 },
        { header: 'Source', key: 'source', width: 30 },
        { header: 'Created at', key: 'createdAt', width: 15 }
    ];

    transactions.map((transaction) => {
        worksheet.addRow({
            id: transaction._id,
            userId: transaction.userId._id,
            userName: transaction.userId.name,
            type: transaction.type,
            amount: transaction.amount,
            subcategory: transaction.subcategoryId.name,
            description: transaction.description,
            date: transaction.date,
            source: transaction.source?.description,
            createdAt: transaction.createdAt
        });
    })

    const buffer = await workbook.xlsx.writeBuffer();

    // Set response headers for Excel file download
    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", `attachment; filename=transactions_${userId}.xlsx`);

    // Send Excel file as response
    res.status(200).end(buffer);
}