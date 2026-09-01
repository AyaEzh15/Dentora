<?php

namespace App\Services;

use App\Models\Invoice;
use App\Models\Prescription;
use App\Models\User;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use TCPDF;

class DentoraPdf extends TCPDF
{
    public function Header() {}

    public function Footer() {}
}

class DocumentPdfService
{
    public function prescription(Prescription $prescription): string
    {
        $prescription->loadMissing(['patient', 'dentist', 'items']);
        $template = $this->resolveTemplate($prescription->dentist, 'ordonnance');
        $pdf = $this->makePdf($template);

        $patient = $prescription->patient;
        $y = 52;

        $pdf->SetTextColor(45, 52, 57);
        $pdf->SetFont('dejavusans', 'B', 11);
        $pdf->SetXY(20, $y);
        $pdf->Cell(110, 7, 'Patient : '.($patient?->name ?? '—'), 0, 0, 'L');
        $pdf->SetFont('dejavusans', '', 10);
        $pdf->Cell(60, 7, 'Date : '.$prescription->prescribed_at?->format('d/m/Y'), 0, 1, 'R');

        $pdf->SetX(20);
        $pdf->Cell(110, 6, 'Dossier : '.($patient?->file_number ?? '—'), 0, 0, 'L');
        $pdf->Cell(60, 6, $patient?->age ? $patient->age.' ans' : '', 0, 1, 'R');

        $pdf->SetDrawColor(0, 107, 95);
        $pdf->SetLineWidth(0.2);
        $pdf->Line(20, 68, 190, 68);

        $pdf->SetXY(20, 72);
        $pdf->SetFont('dejavusans', 'B', 11);
        $pdf->Cell(170, 7, 'Prescription', 0, 1, 'L');

        $pdf->SetFont('dejavusans', '', 10);
        foreach ($prescription->items as $index => $item) {
            $pdf->SetX(20);
            $pdf->SetFont('dejavusans', 'B', 10);
            $pdf->MultiCell(170, 6, ($index + 1).'. '.$item->medication, 0, 'L');
            $details = array_filter([
                $item->dosage,
                $item->frequency,
                $item->duration,
                $item->quantity > 1 ? 'qté '.$item->quantity : null,
            ]);
            if ($details) {
                $pdf->SetX(26);
                $pdf->SetFont('dejavusans', '', 9);
                $pdf->SetTextColor(80, 90, 95);
                $pdf->MultiCell(164, 5, implode('  ·  ', $details), 0, 'L');
                $pdf->SetTextColor(45, 52, 57);
            }
            if ($item->instructions) {
                $pdf->SetX(26);
                $pdf->SetFont('dejavusans', 'I', 9);
                $pdf->MultiCell(164, 5, $item->instructions, 0, 'L');
            }
            $pdf->Ln(2);
        }

        if ($prescription->notes) {
            $pdf->Ln(2);
            $pdf->SetX(20);
            $pdf->SetFont('dejavusans', 'B', 10);
            $pdf->Cell(170, 6, 'Notes', 0, 1, 'L');
            $pdf->SetX(20);
            $pdf->SetFont('dejavusans', '', 9);
            $pdf->MultiCell(170, 5, $prescription->notes, 0, 'L');
        }

        $pdf->SetFont('dejavusans', '', 8);
        $pdf->SetTextColor(120, 128, 132);
        $pdf->SetXY(20, 248);
        $pdf->Cell(170, 5, 'N° '.$prescription->number, 0, 1, 'L');

        return $pdf->Output($prescription->number.'.pdf', 'S');
    }

    public function invoice(Invoice $invoice): string
    {
        $invoice->loadMissing(['patient', 'dentist', 'items', 'payments']);
        $template = $this->resolveTemplate($invoice->dentist, 'facture');
        $pdf = $this->makePdf($template);

        $patient = $invoice->patient;
        $y = 52;

        $pdf->SetTextColor(45, 52, 57);
        $pdf->SetFont('dejavusans', 'B', 11);
        $pdf->SetXY(20, $y);
        $pdf->Cell(110, 7, 'Patient : '.($patient?->name ?? '—'), 0, 0, 'L');
        $pdf->SetFont('dejavusans', '', 10);
        $pdf->Cell(60, 7, 'Date : '.$invoice->issued_at?->format('d/m/Y'), 0, 1, 'R');

        $pdf->SetX(20);
        $pdf->Cell(110, 6, 'Dossier : '.($patient?->file_number ?? '—'), 0, 0, 'L');
        $pdf->Cell(60, 6, 'N° '.$invoice->number, 0, 1, 'R');

        $pdf->SetFillColor(0, 107, 95);
        $pdf->SetTextColor(255, 255, 255);
        $pdf->SetFont('dejavusans', 'B', 9);
        $pdf->SetXY(20, 70);
        $pdf->Cell(90, 8, 'Désignation', 0, 0, 'L', true);
        $pdf->Cell(20, 8, 'Qté', 0, 0, 'C', true);
        $pdf->Cell(30, 8, 'P.U.', 0, 0, 'R', true);
        $pdf->Cell(30, 8, 'Total', 0, 1, 'R', true);

        $pdf->SetTextColor(45, 52, 57);
        $pdf->SetFont('dejavusans', '', 9);
        $fill = false;
        foreach ($invoice->items as $item) {
            $pdf->SetX(20);
            $pdf->SetFillColor(245, 248, 247);
            $pdf->Cell(90, 7, $item->description, 0, 0, 'L', $fill);
            $pdf->Cell(20, 7, (string) $item->quantity, 0, 0, 'C', $fill);
            $pdf->Cell(30, 7, $this->money($item->unit_price), 0, 0, 'R', $fill);
            $pdf->Cell(30, 7, $this->money($item->line_total), 0, 1, 'R', $fill);
            $fill = ! $fill;
        }

        $pdf->Ln(4);
        $pdf->SetX(100);
        $pdf->SetFont('dejavusans', '', 9);
        $pdf->Cell(50, 6, 'Total', 0, 0, 'L');
        $pdf->SetFont('dejavusans', 'B', 10);
        $pdf->Cell(40, 6, $this->money($invoice->total), 0, 1, 'R');

        $pdf->SetX(100);
        $pdf->SetFont('dejavusans', '', 9);
        $pdf->Cell(50, 6, 'Payé', 0, 0, 'L');
        $pdf->Cell(40, 6, $this->money($invoice->paid_amount), 0, 1, 'R');

        $pdf->SetX(100);
        $pdf->SetFont('dejavusans', 'B', 10);
        $pdf->SetTextColor(0, 107, 95);
        $pdf->Cell(50, 7, 'Reste à payer', 0, 0, 'L');
        $pdf->Cell(40, 7, $this->money($invoice->remainingAmount()), 0, 1, 'R');

        $pdf->SetTextColor(45, 52, 57);
        $pdf->SetFont('dejavusans', '', 9);
        $pdf->Ln(6);
        $pdf->SetX(20);
        $pdf->Cell(170, 6, 'Statut : '.($invoice->status?->label() ?? $invoice->status), 0, 1, 'L');

        if ($invoice->payments->isNotEmpty()) {
            $methods = $invoice->payments->map(fn ($payment) => $payment->method?->label().' '.$this->money($payment->amount))->implode('  ·  ');
            $pdf->SetX(20);
            $pdf->MultiCell(170, 5, 'Règlements : '.$methods, 0, 'L');
        }

        if ($invoice->notes) {
            $pdf->Ln(2);
            $pdf->SetX(20);
            $pdf->SetFont('dejavusans', 'I', 9);
            $pdf->MultiCell(170, 5, $invoice->notes, 0, 'L');
        }

        return $pdf->Output($invoice->number.'.pdf', 'S');
    }

    public function resolveTemplate(?User $dentist, string $type): array
    {
        $column = $type === 'facture' ? 'invoice_template_path' : 'prescription_template_path';
        $defaultPdf = public_path('documents/'.$type.'_dentiste.pdf');
        $defaultPng = public_path('documents/'.$type.'_dentiste.png');

        $pdfPath = $dentist?->{$column}
            ? storage_path('app/public/'.$dentist->{$column})
            : $defaultPdf;

        if (! is_file($pdfPath) && ! is_file($defaultPdf) && ! is_file($defaultPng)) {
            throw new NotFoundHttpException(
                'Aucun modèle PDF n’est associé à ce dentiste. L’administrateur doit l’ajouter dans Personnel.'
            );
        }

        $pngPath = is_file($pdfPath) ? preg_replace('/\.pdf$/i', '.png', $pdfPath) : $defaultPng;

        return [
            'pdf' => is_file($pdfPath) ? $pdfPath : $defaultPdf,
            'png' => is_file($pngPath) ? $pngPath : (is_file($defaultPng) ? $defaultPng : null),
        ];
    }

    private function makePdf(array $template): DentoraPdf
    {
        $pdf = new DentoraPdf('P', 'mm', 'A4', true, 'UTF-8', false);
        $pdf->setPrintHeader(false);
        $pdf->setPrintFooter(false);
        $pdf->SetMargins(20, 50, 20);
        $pdf->SetAutoPageBreak(true, 42);
        $pdf->AddPage();

        $png = $template['png'] ?? null;
        if ((! $png || ! is_file($png)) && ! empty($template['pdf']) && is_file($template['pdf'])) {
            $this->rasterizePdf($template['pdf']);
            $png = preg_replace('/\.pdf$/i', '.png', $template['pdf']);
        }

        if ($png && is_file($png)) {
            $pdf->Image($png, 0, 0, 210, 297, '', '', '', false, 300, '', false, false, 0);
        }

        return $pdf;
    }

    private function rasterizePdf(string $pdfPath): void
    {
        $pngPath = preg_replace('/\.pdf$/i', '.png', $pdfPath);
        if (is_file($pngPath) || ! is_file($pdfPath)) {
            return;
        }

        $script = 'import pymupdf; doc=pymupdf.open(r"'.$pdfPath.'"); pix=doc[0].get_pixmap(matrix=pymupdf.Matrix(2,2)); pix.save(r"'.$pngPath.'")';
        @exec('python -c '.escapeshellarg($script));
    }

    private function money(float|string|null $value): string
    {
        return number_format((float) $value, 2, ',', ' ').' MAD';
    }
}
