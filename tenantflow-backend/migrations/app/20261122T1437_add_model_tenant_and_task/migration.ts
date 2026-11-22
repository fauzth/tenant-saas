#!/usr/bin/env -S node
import type { Contract as Start } from '../../snapshots/2252ee5f2a815729ec6985889aa68dced395e3faf398932fd58c1cd46745106d/contract';
import startContract from '../../snapshots/2252ee5f2a815729ec6985889aa68dced395e3faf398932fd58c1cd46745106d/contract.json' with { type: 'json' };
import type { Contract as End } from '../../snapshots/4cb260fcd57f4bc9a5d6a6d243451c11db48eddb3c828191beae81507466aacd/contract';
import endContract from '../../snapshots/4cb260fcd57f4bc9a5d6a6d243451c11db48eddb3c828191beae81507466aacd/contract.json' with { type: 'json' };
import {
  Migration,
  MigrationCLI,
  col,
  fn,
  lit,
  primaryKey,
  sql,
} from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.createTable({
        schema: 'public',
        table: 'Project',
        columns: [
          col('createdAt', 'timestamptz(3)', {
            notNull: true,
            default: fn(sql`now()`),
            codecRef: { codecId: 'pg/timestamptz-date@1', typeParams: { precision: 3 } },
          }),
          col('description', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('name', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('status', 'text', {
            notNull: true,
            default: lit('planning'),
            codecRef: { codecId: 'pg/text@1' },
          }),
          col('tenant_id', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('updatedAt', 'timestamptz(3)', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-date@1', typeParams: { precision: 3 } },
          }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'Task',
        columns: [
          col('approved_by', 'int4', { codecRef: { codecId: 'pg/int4@1' } }),
          col('apprroved_at', 'timestamptz(3)', {
            codecRef: { codecId: 'pg/timestamptz-date@1', typeParams: { precision: 3 } },
          }),
          col('assigned_to', 'int4', { codecRef: { codecId: 'pg/int4@1' } }),
          col('createdAt', 'timestamptz(3)', {
            notNull: true,
            default: fn(sql`now()`),
            codecRef: { codecId: 'pg/timestamptz-date@1', typeParams: { precision: 3 } },
          }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('project_id', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('status', 'text', {
            notNull: true,
            default: lit('todo'),
            codecRef: { codecId: 'pg/text@1' },
          }),
          col('tenant_id', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('title', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('updatedAt', 'timestamptz(3)', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-date@1', typeParams: { precision: 3 } },
          }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createIndex({
        schema: 'public',
        table: 'Project',
        index: 'Project_tenant_id_idx_41c0d441',
        columns: ['tenant_id'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'Task',
        index: 'Task_approved_by_idx_b58b85b1',
        columns: ['approved_by'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'Task',
        index: 'Task_assigned_to_idx_7227a9a2',
        columns: ['assigned_to'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'Task',
        index: 'Task_project_id_idx_6ad92603',
        columns: ['project_id'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'Task',
        index: 'Task_tenant_id_idx_41c0d441',
        columns: ['tenant_id'],
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'Project',
        foreignKey: {
          name: 'Project_tenant_id_fkey',
          columns: ['tenant_id'],
          references: { schema: 'public', table: 'Tenant', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'Task',
        foreignKey: {
          name: 'Task_project_id_fkey',
          columns: ['project_id'],
          references: { schema: 'public', table: 'Project', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'Task',
        foreignKey: {
          name: 'Task_tenant_id_fkey',
          columns: ['tenant_id'],
          references: { schema: 'public', table: 'Tenant', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'Task',
        foreignKey: {
          name: 'Task_assigned_to_fkey',
          columns: ['assigned_to'],
          references: { schema: 'public', table: 'User', columns: ['id'] },
          onDelete: 'setNull',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'Task',
        foreignKey: {
          name: 'Task_approved_by_fkey',
          columns: ['approved_by'],
          references: { schema: 'public', table: 'User', columns: ['id'] },
          onDelete: 'setNull',
        },
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
