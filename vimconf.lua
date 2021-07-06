local cwd = vim.fn.getcwd()
local vm_path = cwd .. "/dart-sdk/sdk/out/DebugX64/dart-sdk/bin/dart"
local snapshot_path = cwd .. 
  "/dart-sdk/sdk/out/DebugX64/dart-sdk/bin/snapshots/analysis_server.dart.snapshot"
require("lspconfig").dartls.setup {
  on_attach = _G._on_lsp_attach,
  cmd = { vm_path, snapshot_path, "--lsp" },
  filetypes = { "dart" },
  init_options = {
    onlyAnalyzeProjectsWithOpenFiles = false,
    suggestFromUnimportedLibraries = true,
    closingLabels = true,
    outline = true,
    flutterOutline = false,
  },
  callbacks = {
    -- get_callback can be called with or without arguments
    ['dart/textDocument/publishClosingLabels'] = require('lsp_extensions.dart.closing_labels').get_callback({highlight = "Special", prefix = " >> "}),
  },
}
