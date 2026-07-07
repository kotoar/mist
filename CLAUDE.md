# CLAUDE.md

本文件为 Claude Code 在本仓库工作时必须遵守的指令。

## Supabase 操作规范（强制）

已连接的 Supabase 项目：`narratist`（ref `wfuyguimukbcbbemjfxg`，区域 eu-west-2）。

**任何对 Supabase 的写操作，都必须先经过用户明确批准，然后才能执行。** 未获批准前不得调用。批准仅对当次操作有效，不自动延伸到后续其他写操作。

### 需要批准的写操作（不完全列举）

- `apply_migration` —— 应用数据库迁移
- `execute_sql` —— **当语句会修改数据或结构时**（`INSERT` / `UPDATE` / `DELETE` / `CREATE` / `ALTER` / `DROP` / `TRUNCATE` / `GRANT` 等）
- `create_branch` / `delete_branch` / `merge_branch` / `rebase_branch` / `reset_branch`
- `deploy_edge_function`
- `create_project` / `pause_project` / `restore_project`
- `confirm_cost`
- 任何其他会改变远端数据、schema、配置或计费状态的调用

### 无需批准的只读操作

以下只读查询可直接执行，用于了解现状、排查问题：

- `list_projects` / `list_organizations` / `get_project` / `get_project_url`
- `list_tables` / `list_migrations` / `list_extensions` / `list_branches`
- `list_edge_functions` / `get_edge_function`
- `execute_sql` —— **仅当为纯 `SELECT` 只读查询时**
- `get_logs` / `get_advisors` / `get_publishable_keys` / `generate_typescript_types`
- `search_docs`

### 执行流程

1. 先用只读工具确认现状（如 `list_tables`）。
2. 需要写操作时，先向用户说明：要做什么、影响哪些表/数据、是否可回滚。
3. 得到用户明确批准后再执行。
4. 若不确定某操作是否算写操作，按写操作处理，先征求批准。
