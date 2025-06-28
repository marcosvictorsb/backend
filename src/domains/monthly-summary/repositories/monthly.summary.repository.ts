import { 
  IMonthlySummaryRepository,
  FindMonthlySummaryCriteria,
  CreateMonthlySummaryCriteria,
  UpdateMonthlySummaryData,
  IMonthlySummaryRepositoryDependencies
} from '../interfaces/monthly.summary.interface';
import { MonthlySummaryEntity } from '../entities/monthly.summary.entity';
import MonthlySummaryModel from '../model/monthly.summary.model';
import { Op } from 'sequelize';

export class MonthlySummaryRepository implements IMonthlySummaryRepository {
  private model: typeof MonthlySummaryModel;

  constructor(dependencies: IMonthlySummaryRepositoryDependencies) {
    this.model = dependencies.model;
  }

  private getConditions(
    criteria: FindMonthlySummaryCriteria
  ): Record<string, any> {
    const whereConditions: Record<string, any> = {};

    if (criteria.id) {
      whereConditions['id'] = criteria.id;
    }

    if (criteria.id_user) {
      whereConditions['id_user'] = criteria.id_user;
    }

    if (criteria.reference_month) {
      whereConditions['reference_month'] = criteria.reference_month;
    }

    return whereConditions;
  }

  async create(
    data: CreateMonthlySummaryCriteria
  ): Promise<MonthlySummaryEntity> {
    const monthlySummary = await this.model.create(data);
    return MonthlySummaryEntity.fromModel(monthlySummary);
  }

  async findById(id: number): Promise<MonthlySummaryEntity | null> {
    const monthlySummary = await this.model.findByPk(id);
    if (!monthlySummary) return null;
    return MonthlySummaryEntity.fromModel(monthlySummary);
  }

  async findAll(
    criteria: FindMonthlySummaryCriteria
  ): Promise<MonthlySummaryEntity[]> {
    const where: any = {};

    if (criteria.id) where.id = criteria.id;
    if (criteria.reference_month)
      where.reference_month = criteria.reference_month;
    if (criteria.id_user) where.id_user = criteria.id_user;
    if (criteria.deleted_at !== undefined)
      where.deleted_at = criteria.deleted_at;

    // Filtros de data
    if (criteria.dateCreateStart || criteria.dateCreateEnd) {
      where.created_at = {};
      if (criteria.dateCreateStart) {
        where.created_at[Op.gte] = criteria.dateCreateStart;
      }
      if (criteria.dateCreateEnd) {
        where.created_at[Op.lte] = criteria.dateCreateEnd;
      }
    }

    const monthlySummaries = await this.model.findAll({
      where,
      order: [['created_at', 'DESC']]
    });

    return monthlySummaries.map((summary) =>
      MonthlySummaryEntity.fromModel(summary)
    );
  }

  async findOne(
    criteria: FindMonthlySummaryCriteria
  ): Promise<MonthlySummaryEntity | null> {
    const where: any = {};

    if (criteria.id) where.id = criteria.id;
    if (criteria.reference_month)
      where.reference_month = criteria.reference_month;
    if (criteria.id_user) where.id_user = criteria.id_user;
    if (criteria.deleted_at !== undefined)
      where.deleted_at = criteria.deleted_at;

    const monthlySummary = await this.model.findOne({ where });
    if (!monthlySummary) return null;
    return MonthlySummaryEntity.fromModel(monthlySummary);
  }

  async update(
    id: number,
    data: UpdateMonthlySummaryData
  ): Promise<MonthlySummaryEntity | null> {
    const [affectedRows] = await this.model.update(data, {
      where: { id }
    });

    if (affectedRows === 0) return null;

    const updatedSummary = await this.findById(id);
    return updatedSummary;
  }

  async delete(id: number): Promise<boolean> {
    const affectedRows = await this.model.destroy({
      where: { id }
    });
    return affectedRows > 0;
  }

  async findByUserAndMonth(
    userId: number,
    referenceMonth: string
  ): Promise<MonthlySummaryEntity | null> {
    return this.findOne({
      id_user: userId,
      reference_month: referenceMonth
    });
  }
}
