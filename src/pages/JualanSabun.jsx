import { useState, useMemo, useEffect } from "react";
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  Box,
  Typography,
  Chip,
  IconButton,
  TextField,
  Button,
  Tabs,
  Tab,
  Card,
  CardContent,
  Stack,
  Divider,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  InputAdornment,
  Paper,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import SoapIcon from "@mui/icons-material/Soap";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import PreviewIcon from "@mui/icons-material/Preview";

const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/jualan`;
const THEME_COLOR = "#0F6E56";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: { main: THEME_COLOR, contrastText: "#fff" },
    secondary: { main: "#D4537E" },
    background: { default: "#F7FAF9", paper: "#ffffff" },
    success: { main: "#1D9E75" },
  },
  typography: {
    fontFamily: "'DM Sans', sans-serif",
    h5: { fontWeight: 600, letterSpacing: "-0.3px" },
    subtitle2: { fontWeight: 500 },
  },
  shape: { borderRadius: 10 },
  components: {
    MuiCard: {
      styleOverrides: {
        root: { boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #E8F0ED" },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: { textTransform: "none", fontWeight: 500, borderRadius: 8 },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: { textTransform: "none", fontWeight: 500, minHeight: 36, fontSize: 13 },
      },
    },
    MuiChip: {
      styleOverrides: { root: { fontWeight: 500 } },
    },
    MuiTextField: {
      defaultProps: { size: "small" },
    },
  },
});

const INITIAL_FOLDERS = [
  {
    id: "S13",
    label: "📁 S13",
    color: "#0F6E56",
    members: ["TC","TFY","TAA","THAH","MSMN","AL","E ZAHID","E SAYUTI","E ABU","E FAJRUL","P Azura"],
    amounts: Array(11).fill(0),
  },
  {
    id: "MKN",
    label: "📁 MKN ++",
    color: "#185FA5",
    members: ["T ABIL","T FATEH","TN SYARIF","TN WAJI","E KHUS","T NHAZANI","TN ANUAR","TN HAMDI","TN FIDA"],
    amounts: [100,0,0,0,0,100,0,0],
  },
  {
    id: "MUSLIMAH",
    label: "📁 Muslimah",
    color: "#993556",
    members: ["PN KAKAK","P KHAULAH","PN QAYAH","C YAH"],
    amounts: Array(4).fill(0),
  },
  {
    id: "L_LELAKI",
    label: "📁 Lain² Lelaki",
    color: "#854F0B",
    members: ["T Abbad","PAK NANANG","EN NIK H","EN ABE Thai","TN MAAROF","EN P WAHAB","EN IKRIMAH","Am Kamil","T Amin","Hj Kudus","En Yusniza","En Ali H","En Arobi","En Khalid","En Jaafar","Tn Ridwan"],
    amounts: [0,0,0,0,0,0,100,0,0,0,0,0,0,100,200],
  },
  {
    id: "L_MUSLIMAH",
    label: "📁 Lain² Muslimah",
    color: "#72243E",
    members: ["C AZIE","C K NGAH","C SAKINAH","C ASILAH","C Ita","C YATI","C (OM)","C HAFIZAH","C Sal","C Fah","I Gina"],
    amounts: [0,0,0,0,0,100,0,0,0,0],
  },
  {
    id: "KOMUNITI",
    label: "📁 Komuniti",
    color: "#534AB7",
    members: ["APS","Amca","Dungun","LB","Perak"],
    amounts: Array(5).fill(0),
  },
];

const QUICK_AMOUNTS = [50, 100, 200];

export default function JualanSabun() {
  const [folders, setFolders] = useState(INITIAL_FOLDERS);
  const [activeTab, setActiveTab] = useState(0);
  const [newMemberName, setNewMemberName] = useState("");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [snackMsg, setSnackMsg] = useState("");
  const [resetDialog, setResetDialog] = useState(false);

  const updateAmount = (fi, mi, val) => {
    const v = Math.max(0, parseInt(val) || 0);
    setFolders(prev => {
      const next = prev.map((f, i) => {
        if (i !== fi) return f;
        const amounts = [...f.amounts];
        amounts[mi] = v;
        return { ...f, amounts };
      });
      return next;
    });
  };

  const addMember = (fi) => {
    const name = newMemberName.trim();
    if (!name) return;
    setFolders(prev =>
      prev.map((f, i) =>
        i !== fi
          ? f
          : { ...f, members: [...f.members, name], amounts: [...f.amounts, 0] }
      )
    );
    setNewMemberName("");
  };

  const resetAll = () => {
    setFolders(INITIAL_FOLDERS.map(f => ({ ...f, amounts: Array(f.members.length).fill(0) })));
    setResetDialog(false);
    setSnackMsg("Data berjaya diset semula");
  };

  const folderTotal = (f) => f.amounts.reduce((a, b) => a + b, 0);
  const grandTotal = useMemo(() => folders.reduce((a, f) => a + folderTotal(f), 0), [folders]);
  const totalAhli = useMemo(() => folders.reduce((a, f) => a + f.members.length, 0), [folders]);
  const totalBayar = useMemo(() => folders.reduce((a, f) => a + f.amounts.filter(x => x > 0).length, 0), [folders]);

  const buildText = () => {
    const lines = ["🗓️ *JUALAN SABUN MEI 2026*", ""];
    folders.forEach(f => {
      lines.push(`*${f.label}*`);
      f.members.forEach((m, i) => {
        const amt = f.amounts[i];
        lines.push(`${i + 1}. ${m.padEnd(16)} ${amt > 0 ? "RM " + amt : "—"}`);
      });
      lines.push(`KEMASUKAN : RM ${folderTotal(f).toLocaleString()}`);
      lines.push("=================");
    });
    lines.push(`\n*JUMLAH : RM ${grandTotal.toLocaleString()}*`);
    return lines.join("\n");
  };

  const copyText = () => {
    navigator.clipboard.writeText(buildText());
    setSnackMsg("Rekap disalin ke clipboard");
  };

  const shareWA = () => {
    window.open("https://wa.me/?text=" + encodeURIComponent(buildText()), "_blank");
  };

  const activeFolder = folders[activeTab];
  const activeFolderTotal = folderTotal(activeFolder);
  const activePaid = activeFolder.amounts.filter(x => x > 0).length;

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&display=swap" rel="stylesheet" />

      <Box sx={{ minHeight: "100vh", bgcolor: "background.default", py: 3, px: { xs: 2, sm: 3 } }}>
        <Box sx={{ maxWidth: 680, mx: "auto" }}>

          {/* Header */}
          <Stack direction="row" alignItems="flex-start" justifyContent="space-between" mb={3}>
            <Box>
              <Stack direction="row" alignItems="center" gap={1} mb={0.5}>
                <SoapIcon sx={{ color: "primary.main", fontSize: 22 }} />
                <Typography variant="h5" component="h1" color="text.primary">
                  Jualan Sabun
                </Typography>
              </Stack>
              <Typography variant="body2" color="text.secondary">Mei 2026 · Rekod kemasukan bulanan</Typography>
            </Box>
            <Tooltip title="Set semula semua data">
              <IconButton size="small" onClick={() => setResetDialog(true)} sx={{ color: "text.secondary" }}>
                <RestartAltIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Stack>

          {/* Summary Cards */}
          <Box display="grid" gridTemplateColumns="repeat(3,1fr)" gap={1.5} mb={3}>
            {[
              { label: "Jumlah Ahli", value: totalAhli },
              { label: "Sudah Bayar", value: totalBayar },
              { label: `Kemasukan (RM)`, value: grandTotal.toLocaleString() },
            ].map(s => (
              <Card key={s.label}>
                <CardContent sx={{ p: "12px 14px !important" }}>
                  <Typography variant="caption" color="text.secondary" display="block" mb={0.5}>{s.label}</Typography>
                  <Typography variant="h5" component="div" color="primary.main">{s.value}</Typography>
                </CardContent>
              </Card>
            ))}
          </Box>

          {/* Folder Tabs */}
          <Card sx={{ mb: 2 }}>
            <Tabs
              value={activeTab}
              onChange={(_, v) => setActiveTab(v)}
              variant="scrollable"
              scrollButtons="auto"
              sx={{
                minHeight: 44,
                borderBottom: "1px solid",
                borderColor: "divider",
                px: 1,
                "& .MuiTabs-indicator": { height: 2.5, borderRadius: 2 },
              }}
            >
              {folders.map((f, i) => {
                const paid = f.amounts.filter(x => x > 0).length;
                return (
                  <Tab
                    key={f.id}
                    label={
                      <Stack direction="row" alignItems="center" gap={0.75}>
                        <span>{f.label.replace("📁 ", "")}</span>
                        {paid > 0 && (
                          <Chip
                            label={paid}
                            size="small"
                            sx={{
                              height: 16,
                              fontSize: 10,
                              bgcolor: f.color + "22",
                              color: f.color,
                              "& .MuiChip-label": { px: "5px" },
                            }}
                          />
                        )}
                      </Stack>
                    }
                    sx={{ fontSize: 12, minHeight: 44, px: 1.5 }}
                  />
                );
              })}
            </Tabs>

            {/* Folder Header */}
            <Box
              sx={{
                px: 2,
                py: 1.25,
                bgcolor: activeFolder.color + "0D",
                borderBottom: "1px solid",
                borderColor: "divider",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Typography variant="subtitle2" sx={{ color: activeFolder.color }}>
                {activeFolder.label}
              </Typography>
              <Stack direction="row" alignItems="center" gap={1}>
                <Chip
                  label={`${activePaid}/${activeFolder.members.length} bayar`}
                  size="small"
                  sx={{ fontSize: 11, bgcolor: activeFolder.color + "20", color: activeFolder.color, height: 22 }}
                />
                <Typography variant="subtitle2" sx={{ color: activeFolder.color }}>
                  RM {activeFolderTotal.toLocaleString()}
                </Typography>
              </Stack>
            </Box>

            {/* Member Rows */}
            <Box>
              {activeFolder.members.map((name, mi) => {
                const amt = activeFolder.amounts[mi];
                const paid = amt > 0;
                return (
                  <Box
                    key={mi}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1.5,
                      px: 2,
                      py: 1,
                      borderBottom: "1px solid",
                      borderColor: "divider",
                      "&:last-child": { borderBottom: "none" },
                      transition: "background 0.12s",
                      "&:hover": { bgcolor: "grey.50" },
                      bgcolor: paid ? activeFolder.color + "06" : "transparent",
                    }}
                  >
                    <Typography variant="caption" color="text.disabled" sx={{ minWidth: 20, textAlign: "right" }}>
                      {mi + 1}.
                    </Typography>

                    {paid
                      ? <CheckCircleOutlineIcon sx={{ fontSize: 16, color: activeFolder.color, flexShrink: 0 }} />
                      : <RadioButtonUncheckedIcon sx={{ fontSize: 16, color: "text.disabled", flexShrink: 0 }} />
                    }

                    <Typography variant="body2" sx={{ flex: 1, fontWeight: paid ? 500 : 400, color: paid ? "text.primary" : "text.secondary" }}>
                      {name}
                    </Typography>

                    {/* Quick amount chips */}
                    <Stack direction="row" gap={0.5} sx={{ display: { xs: "none", sm: "flex" } }}>
                      {QUICK_AMOUNTS.map(q => (
                        <Chip
                          key={q}
                          label={q}
                          size="small"
                          clickable
                          onClick={() => updateAmount(activeTab, mi, amt === q ? 0 : q)}
                          sx={{
                            height: 22,
                            fontSize: 11,
                            cursor: "pointer",
                            bgcolor: amt === q ? activeFolder.color : "transparent",
                            color: amt === q ? "#fff" : "text.secondary",
                            border: "1px solid",
                            borderColor: amt === q ? activeFolder.color : "divider",
                            "& .MuiChip-label": { px: "7px" },
                          }}
                        />
                      ))}
                    </Stack>

                    <TextField
                      value={amt === 0 ? "" : amt}
                      onChange={e => updateAmount(activeTab, mi, e.target.value)}
                      placeholder="0"
                      inputProps={{ style: { textAlign: "right", padding: "5px 8px", fontSize: 13, width: 60 } }}
                      InputProps={{
                        startAdornment: <InputAdornment position="start"><Typography variant="caption" color="text.secondary">RM</Typography></InputAdornment>,
                        sx: {
                          borderRadius: 1.5,
                          bgcolor: paid ? activeFolder.color + "12" : "background.paper",
                          "& fieldset": { borderColor: paid ? activeFolder.color + "60" : undefined },
                          "&:hover fieldset": { borderColor: activeFolder.color + "80 !important" },
                          "&.Mui-focused fieldset": { borderColor: activeFolder.color + " !important" },
                        },
                      }}
                      sx={{ width: 110 }}
                    />
                  </Box>
                );
              })}

              {/* Add Member Row */}
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, px: 2, py: 1, borderTop: "1px dashed", borderColor: "divider" }}>
                <PersonAddIcon sx={{ fontSize: 16, color: "text.disabled" }} />
                <TextField
                  value={newMemberName}
                  onChange={e => setNewMemberName(e.target.value)}
                  placeholder="Nama ahli baru..."
                  onKeyDown={e => e.key === "Enter" && addMember(activeTab)}
                  inputProps={{ style: { fontSize: 13, padding: "5px 8px" } }}
                  sx={{ flex: 1 }}
                />
                <Button
                  size="small"
                  variant="outlined"
                  startIcon={<AddIcon />}
                  onClick={() => addMember(activeTab)}
                  disabled={!newMemberName.trim()}
                  sx={{ borderColor: activeFolder.color, color: activeFolder.color, "&:hover": { bgcolor: activeFolder.color + "10", borderColor: activeFolder.color } }}
                >
                  Tambah
                </Button>
              </Box>
            </Box>

            {/* Footer */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                px: 2,
                py: 1.25,
                bgcolor: "background.default",
                borderTop: "1px solid",
                borderColor: "divider",
              }}
            >
              <Typography variant="caption" color="text.secondary">Kemasukan {activeFolder.label}</Typography>
              <Typography variant="subtitle2" sx={{ color: activeFolder.color }}>
                RM {activeFolderTotal.toLocaleString()}
              </Typography>
            </Box>
          </Card>

          {/* Grand Total */}
          <Paper
            variant="outlined"
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              px: 2,
              py: 1.5,
              mb: 2,
              bgcolor: "primary.main" + "08",
              borderColor: "primary.main" + "30",
            }}
          >
            <Typography variant="subtitle2" color="text.secondary">Jumlah Keseluruhan</Typography>
            <Typography variant="h5" color="primary.main">RM {grandTotal.toLocaleString()}</Typography>
          </Paper>

          {/* Action Buttons */}
          <Stack direction="row" gap={1} flexWrap="wrap">
            <Button
              variant="contained"
              startIcon={<WhatsAppIcon />}
              onClick={shareWA}
              sx={{ bgcolor: "#25D366", "&:hover": { bgcolor: "#1da851" }, flex: 1, minWidth: 140 }}
            >
              Share ke WhatsApp
            </Button>
            <Button
              variant="outlined"
              startIcon={<PreviewIcon />}
              onClick={() => setPreviewOpen(true)}
              sx={{ flex: 1, minWidth: 120 }}
            >
              Lihat Rekap
            </Button>
            <Button
              variant="outlined"
              startIcon={<ContentCopyIcon />}
              onClick={copyText}
              color="inherit"
            >
              Salin
            </Button>
          </Stack>
        </Box>
      </Box>

      {/* Preview Dialog */}
      <Dialog open={previewOpen} onClose={() => setPreviewOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 500, fontSize: 16 }}>
          <Stack direction="row" alignItems="center" gap={1}>
            <PreviewIcon fontSize="small" />
            Rekap Jualan Sabun
          </Stack>
        </DialogTitle>
        <DialogContent dividers>
          <Box
            component="pre"
            sx={{
              fontFamily: "monospace",
              fontSize: 12,
              whiteSpace: "pre-wrap",
              bgcolor: "background.default",
              p: 2,
              borderRadius: 1,
              color: "text.primary",
            }}
          >
            {buildText()}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={copyText} startIcon={<ContentCopyIcon />} size="small">Salin</Button>
          <Button onClick={shareWA} startIcon={<WhatsAppIcon />} size="small" variant="contained" sx={{ bgcolor: "#25D366", "&:hover": { bgcolor: "#1da851" } }}>
            Share WA
          </Button>
          <Button onClick={() => setPreviewOpen(false)} size="small" color="inherit">Tutup</Button>
        </DialogActions>
      </Dialog>

      {/* Reset Dialog */}
      <Dialog open={resetDialog} onClose={() => setResetDialog(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 500, fontSize: 15 }}>Set semula data?</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary">
            Semua kemasukan akan dipadam dan dikembalikan ke asal. Tindakan ini tidak boleh dibatalkan.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setResetDialog(false)} color="inherit" size="small">Batal</Button>
          <Button onClick={resetAll} color="error" variant="contained" size="small">Set Semula</Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={!!snackMsg}
        autoHideDuration={2500}
        onClose={() => setSnackMsg("")}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity="success" variant="filled" sx={{ fontSize: 13 }}>{snackMsg}</Alert>
      </Snackbar>
    </ThemeProvider>
  );
}