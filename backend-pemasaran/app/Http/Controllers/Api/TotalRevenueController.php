<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\MPeriode;
use App\Models\FinanceRevenueDetail;
use Illuminate\Http\Request;

class TotalRevenueController extends Controller
{
    public function index(Request $request)
    {
        $type = $request->query('type');
        $year = $request->query('year');
        $month = $request->query('month');

        if ($type === 'mtd' && $month) {
            $periodeId = MPeriode::byYearMonth($year, $month)->value('id_periode');

            $total = FinanceRevenueDetail::where('m_periode_id', $periodeId)
                ->sum('mtd_realisasi');
        } else {
            $periodeIds = MPeriode::byYear($year)->pluck('id_periode');

            $total = FinanceRevenueDetail::whereIn('m_periode_id', $periodeIds)
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
                'total_revenue' => $formatted
            ]
        ]);
    }
}

