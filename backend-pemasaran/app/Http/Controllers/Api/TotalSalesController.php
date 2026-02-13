<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\MPeriode;
use App\Models\FinanceSalesDetail;
use Illuminate\Http\Request;

class TotalSalesController extends Controller
{
    public function index(Request $request)
    {
        $type = $request->query('type');
        $year = $request->query('year');
        $month = $request->query('month');

        if ($type === 'mtd' && $month) {
            $periodeId = MPeriode::where('tahun', $year)
                ->where('bulan', $month)
                ->value('id_periode');

            $total = FinanceSalesDetail::where('m_periode_id', $periodeId)
                ->where('r_jenis_sales_id', 2)
                ->sum('mtd_realisasi');
        } else {
            $periodeIds = MPeriode::where('tahun', $year)
                ->pluck('id_periode');

            $total = FinanceSalesDetail::whereIn('m_periode_id', $periodeIds)
                ->where('r_jenis_sales_id', 2)
                ->sum('mtd_realisasi');
        }

        if ($total == 0) {
            $formatted = ($type === 'ytd' || !$month) ? 'Data tidak tersedia' : '-';
        } else {
            $formatted = $total;
        }

        return response()->json([
            'status' => 'success',
            'data' => [
                'total_sales' => $formatted
            ]
        ]);
    }
}

