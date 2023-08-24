import { PrismaClient } from "@prisma/client";
import {
  CreateReport,
  Report,
  ReportSchema,
  UpdateReportStatus,
} from "../api/schemas/report.schema";

export class ReportRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async getAllReports(): Promise<Report[]> {
    const rawReports = await this.prisma.reports.findMany({
      include: {
        users: true,
      },
    });
    const reports = rawReports.map((report) => ReportSchema.parse(report));
    return reports;
  }

  async getReportByUser(zid: string): Promise<Report[]> {
    const rawReports = await this.prisma.reports.findMany({
      where: {
        zid: zid,
      },
      include: {
        reviews: true,
      },
    });
    const reports = rawReports.map((report) => ReportSchema.parse(report));
    return reports;
  }

  async getReportByUserAndReview(zid: string, reviewId: string) {
    const rawReport = await this.prisma.reports.findFirst({
      where: {
        zid: zid,
        reviewId: reviewId,
      },
      include: {
        users: true,
      },
    });
    return rawReport;
  }

  async getReport(reportId: string) {
    const rawReport = await this.prisma.reports.findUnique({
      where: {
        reportId: reportId,
      },
      include: {
        users: true,
      },
    });
    return rawReport;
  }

  async newReport(report: CreateReport) {
    const rawReport = await this.prisma.reports.create({
      data: {
        ...report,
        status: "UNSEEN",
      },
      include: {
        users: true,
      },
    });
    return rawReport;
  }

  async updateReport(report: UpdateReportStatus) {
    const updatedReport = await this.prisma.reports.update({
      where: {
        reportId: report.reportId,
      },
      data: {
        ...report,
      },
    });
    return updatedReport;
  }
}
