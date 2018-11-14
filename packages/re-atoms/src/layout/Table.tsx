import * as React from 'react'

export type TdProps = React.HTMLAttributes<HTMLTableCellElement>

export const Td: React.SFC<TdProps> =
    (props: TdProps) =>
        <td {...props} />

export type ThProps = React.HTMLAttributes<HTMLTableHeaderCellElement>

export const Th: React.SFC<ThProps> =
    (props: ThProps) =>
        <th {...props} />

export type TRowProps = React.HTMLAttributes<HTMLTableRowElement>

export const TRow: React.SFC<TRowProps> =
    (props: TRowProps) =>
        <tr {...props} />

export type TableProps = React.HTMLAttributes<HTMLTableElement>

export const Table: React.SFC<TableProps> =
    (props: TableProps) =>
        <table {...props} />

export type TSectionProps = React.HTMLAttributes<HTMLTableSectionElement>

export const THead: React.SFC<TSectionProps> =
    (props: TSectionProps) =>
        <thead {...props} />

export const TBody: React.SFC<TSectionProps> =
    (props: TSectionProps) =>
        <tbody {...props} />

export const TFoot: React.SFC<TSectionProps> =
    (props: TSectionProps) =>
        <tfoot {...props} />
