import { useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Upload, Download, FileSpreadsheet, CheckCircle2, AlertCircle } from "lucide-react";
import * as XLSX from "xlsx";
import { Task } from "@/types";

interface ImportExcelDialogProps {
  onImportTasks: (tasks: Omit<Task, 'id' | 'createdAt' | 'archived'>[]) => void;
}

type ImportStatus = 'idle' | 'success' | 'error';

export function ImportExcelDialog({ onImportTasks }: ImportExcelDialogProps) {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<ImportStatus>('idle');
  const [message, setMessage] = useState('');
  const [importedCount, setImportedCount] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDownloadSample = () => {
    const link = document.createElement('a');
    link.href = '/sample-tasks.csv';
    link.download = 'sample-tasks.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const parseRepetition = (value: string): Task['repetition'] => {
    const lower = value?.toLowerCase()?.trim();
    if (lower === 'weekdays') return 'weekdays';
    if (lower === 'weekends') return 'weekends';
    if (lower === 'weekly' || lower === 'custom') return 'custom';
    return 'daily';
  };

  const parseCategory = (value: string): Task['category'] => {
    const lower = value?.toLowerCase()?.trim();
    if (lower === 'work') return 'work';
    if (lower === 'personal') return 'personal';
    return 'health';
  };

  const parseType = (value: string): Task['type'] => {
    const lower = value?.toLowerCase()?.trim();
    if (lower === 'numeric') return 'numeric';
    return 'binary';
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json<Record<string, string>>(worksheet);

      if (jsonData.length === 0) {
        setStatus('error');
        setMessage('No data found in the file');
        return;
      }

      const tasks: Omit<Task, 'id' | 'createdAt' | 'archived'>[] = jsonData
        .filter(row => row.title?.trim())
        .map(row => {
          const taskType = parseType(row.type);
          return {
            title: row.title.trim(),
            description: row.description?.trim() || undefined,
            category: parseCategory(row.category),
            type: taskType,
            target: taskType === 'numeric' ? (parseInt(row.target) || 1) : undefined,
            unit: taskType === 'numeric' ? (row.unit?.trim() || 'units') : undefined,
            repetition: parseRepetition(row.repetition),
          };
        });

      if (tasks.length === 0) {
        setStatus('error');
        setMessage('No valid tasks found. Make sure each row has a title.');
        return;
      }

      onImportTasks(tasks);
      setImportedCount(tasks.length);
      setStatus('success');
      setMessage(`Successfully imported ${tasks.length} task${tasks.length > 1 ? 's' : ''}`);
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      setStatus('error');
      setMessage('Failed to parse file. Please use the sample format.');
    }
  };

  const handleClose = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      setStatus('idle');
      setMessage('');
      setImportedCount(0);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Upload className="h-4 w-4" />
          Import tasks
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5 text-primary" />
            Import Tasks from Excel
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Step 1: Download Sample */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs">1</span>
              Download Sample File
            </div>
            <p className="text-sm text-muted-foreground pl-8">
              Download the sample file to see the correct format for importing tasks.
            </p>
            <div className="pl-8">
              <Button variant="secondary" size="sm" onClick={handleDownloadSample} className="gap-2">
                <Download className="h-4 w-4" />
                Download Sample CSV
              </Button>
            </div>
          </div>

          {/* Step 2: Upload File */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs">2</span>
              Upload Your File
            </div>
            <p className="text-sm text-muted-foreground pl-8">
              Fill in your tasks using the sample format, then upload the file (CSV or Excel).
            </p>
            <div className="pl-8">
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,.xlsx,.xls"
                onChange={handleFileUpload}
                className="hidden"
                id="excel-upload"
              />
              <Button
                variant="default"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                className="gap-2"
              >
                <Upload className="h-4 w-4" />
                Upload File
              </Button>
            </div>
          </div>

          {/* Status Message */}
          {status !== 'idle' && (
            <div className={`flex items-center gap-2 p-3 rounded-lg ${
              status === 'success' 
                ? 'bg-green-500/10 text-green-600 dark:text-green-400' 
                : 'bg-destructive/10 text-destructive'
            }`}>
              {status === 'success' ? (
                <CheckCircle2 className="h-5 w-5" />
              ) : (
                <AlertCircle className="h-5 w-5" />
              )}
              <span className="text-sm font-medium">{message}</span>
            </div>
          )}

          {/* Format Info */}
          <div className="bg-muted/50 rounded-lg p-4 space-y-2">
            <p className="text-xs font-medium text-muted-foreground">Expected columns:</p>
            <div className="grid grid-cols-2 gap-1 text-xs text-muted-foreground">
              <span>• title (required)</span>
              <span>• description</span>
              <span>• category (health/work/personal)</span>
              <span>• type (binary/numeric)</span>
              <span>• target (for numeric)</span>
              <span>• unit (for numeric)</span>
              <span>• repetition (daily/weekdays/weekends/weekly)</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
