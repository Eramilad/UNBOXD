import React, { useState } from 'react';
import { Plus, Trash2, Save, Download, Edit3, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface CSVRow {
  id: string;
  data: Record<string, string>;
  errors: string[];
  isValid: boolean;
}

interface MultiRowEditorProps {
  rows: CSVRow[];
  onUpdate: (rows: CSVRow[]) => void;
  onSaveTemplate: (templateName: string) => void;
}

const MultiRowEditor: React.FC<MultiRowEditorProps> = ({ rows, onUpdate, onSaveTemplate }) => {
  const [editingRow, setEditingRow] = useState<string | null>(null);
  const [editData, setEditData] = useState<Record<string, string>>({});
  const [templateName, setTemplateName] = useState('');
  const [showTemplateDialog, setShowTemplateDialog] = useState(false);

  const headers = rows.length > 0 ? Object.keys(rows[0].data) : [];

  const validateRow = (rowData: Record<string, string>): string[] => {
    const errors: string[] = [];
    
    const requiredFields = ['name', 'email', 'phone', 'pickup_date', 'pickup_address', 'delivery_address'];
    requiredFields.forEach(field => {
      if (!rowData[field] || rowData[field].trim() === '') {
        errors.push(`Missing required field: ${field}`);
      }
    });

    if (rowData.pickup_date) {
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(rowData.pickup_date)) {
        errors.push(`Invalid date format (expected YYYY-MM-DD)`);
      }
    }

    if (rowData.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(rowData.email)) {
        errors.push(`Invalid email format`);
      }
    }

    if (rowData.phone) {
      const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
      if (!phoneRegex.test(rowData.phone.replace(/\s/g, ''))) {
        errors.push(`Invalid phone format`);
      }
    }

    return errors;
  };

  const startEdit = (row: CSVRow) => {
    setEditingRow(row.id);
    setEditData({ ...row.data });
  };

  const cancelEdit = () => {
    setEditingRow(null);
    setEditData({});
  };

  const saveEdit = () => {
    if (!editingRow) return;

    const errors = validateRow(editData);
    const updatedRows = rows.map(row => 
      row.id === editingRow 
        ? { ...row, data: editData, errors, isValid: errors.length === 0 }
        : row
    );

    onUpdate(updatedRows);
    setEditingRow(null);
    setEditData({});
  };

  const removeRow = (rowId: string) => {
    const updatedRows = rows.filter(row => row.id !== rowId);
    onUpdate(updatedRows);
  };

  const addRow = () => {
    const newRow: CSVRow = {
      id: `row-${Date.now()}`,
      data: headers.reduce((acc, header) => ({ ...acc, [header]: '' }), {}),
      errors: [],
      isValid: false
    };
    onUpdate([...rows, newRow]);
    startEdit(newRow);
  };

  const handleBulkAction = (action: 'selectAll' | 'removeSelected' | 'validateAll') => {
    switch (action) {
      case 'selectAll':
        // Implement select all logic
        break;
      case 'removeSelected':
        // Implement remove selected logic
        break;
      case 'validateAll':
        const validatedRows = rows.map(row => {
          const errors = validateRow(row.data);
          return { ...row, errors, isValid: errors.length === 0 };
        });
        onUpdate(validatedRows);
        break;
    }
  };

  const downloadCSV = () => {
    const csvContent = [
      headers.join(','),
      ...rows.map(row => 
        headers.map(header => `"${row.data[header] || ''}"`).join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'bulk-booking-data.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const validRows = rows.filter(row => row.isValid);
  const errorRows = rows.filter(row => !row.isValid);

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Multi-Row Editor</CardTitle>
              <CardDescription>
                Edit, validate, and manage your bulk booking data
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => handleBulkAction('validateAll')}>
                <Check className="w-4 h-4 mr-2" />
                Validate All
              </Button>
              <Button variant="outline" onClick={downloadCSV}>
                <Download className="w-4 h-4 mr-2" />
                Download CSV
              </Button>
              <Button onClick={addRow}>
                <Plus className="w-4 h-4 mr-2" />
                Add Row
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Summary Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{rows.length}</div>
            <div className="text-sm text-gray-600">Total Rows</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{validRows.length}</div>
            <div className="text-sm text-gray-600">Valid</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600">{errorRows.length}</div>
            <div className="text-sm text-gray-600">Errors</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">
              ${(validRows.length * 150).toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">Est. Total</div>
          </CardContent>
        </Card>
      </div>

      {/* Data Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">Status</TableHead>
                  {headers.map(header => (
                    <TableHead key={header} className="min-w-[120px]">
                      {header.replace('_', ' ').toUpperCase()}
                    </TableHead>
                  ))}
                  <TableHead className="w-32">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((row, index) => (
                  <TableRow key={row.id} className={!row.isValid ? 'bg-red-50' : ''}>
                    <TableCell>
                      {row.isValid ? (
                        <Badge variant="default" className="bg-green-100 text-green-800">
                          <Check className="w-3 h-3 mr-1" />
                          Valid
                        </Badge>
                      ) : (
                        <Badge variant="destructive">
                          <X className="w-3 h-3 mr-1" />
                          Error
                        </Badge>
                      )}
                    </TableCell>
                    
                    {headers.map(header => (
                      <TableCell key={header}>
                        {editingRow === row.id ? (
                          <Input
                            value={editData[header] || ''}
                            onChange={(e) => setEditData(prev => ({ ...prev, [header]: e.target.value }))}
                            className="h-8"
                            placeholder={`Enter ${header}`}
                          />
                        ) : (
                          <div className="truncate max-w-[200px]" title={row.data[header]}>
                            {row.data[header] || '-'}
                          </div>
                        )}
                      </TableCell>
                    ))}
                    
                    <TableCell>
                      <div className="flex gap-1">
                        {editingRow === row.id ? (
                          <>
                            <Button size="sm" variant="ghost" onClick={saveEdit}>
                              <Check className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="ghost" onClick={cancelEdit}>
                              <X className="w-4 h-4" />
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button size="sm" variant="ghost" onClick={() => startEdit(row)}>
                              <Edit3 className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="ghost" onClick={() => removeRow(row.id)}>
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Error Details */}
      {errorRows.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-red-600">Validation Errors</CardTitle>
            <CardDescription>
              Fix the following errors before proceeding
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {errorRows.map((row, index) => (
                <Alert key={row.id} variant="destructive">
                  <AlertDescription>
                    <strong>Row {index + 1}:</strong> {row.errors.join(', ')}
                  </AlertDescription>
                </Alert>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Save Template Dialog */}
      {showTemplateDialog && (
        <Card className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-96">
            <CardHeader>
              <CardTitle>Save as Template</CardTitle>
              <CardDescription>
                Save this configuration for future use
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="template-name">Template Name</Label>
                <Input
                  id="template-name"
                  value={templateName}
                  onChange={(e) => setTemplateName(e.target.value)}
                  placeholder="e.g., Q1 2024 Corporate Moves"
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={() => {
                  onSaveTemplate(templateName);
                  setShowTemplateDialog(false);
                  setTemplateName('');
                }}>
                  <Save className="w-4 h-4 mr-2" />
                  Save Template
                </Button>
                <Button variant="outline" onClick={() => setShowTemplateDialog(false)}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </Card>
      )}

      {/* Template Actions */}
      <Card>
        <CardContent className="p-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-semibold">Template Actions</h3>
              <p className="text-sm text-gray-600">Save your configuration for reuse</p>
            </div>
            <Button variant="outline" onClick={() => setShowTemplateDialog(true)}>
              <Save className="w-4 h-4 mr-2" />
              Save as Template
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MultiRowEditor;
