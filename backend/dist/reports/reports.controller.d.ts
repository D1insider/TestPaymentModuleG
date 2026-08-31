import { ReportsService } from './reports.service';
export declare class ReportsController {
    private readonly reports;
    constructor(reports: ReportsService);
    summary(): Promise<{
        orders: {
            id: string;
            amount: string;
            paid: string;
            remaining: string;
            overpayment: string;
            status: string;
            paymentCount: number;
            createdAt: Date;
        }[];
        totals: {
            amount: string;
            paid: string;
            remaining: string;
            overpayment: string;
            ordersByStatus: {
                UNPAID: number;
                PARTIALLY_PAID: number;
                PAID: number;
            };
        };
    }>;
}
