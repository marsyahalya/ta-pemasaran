<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\MPeriode;
use App\Models\FinanceRevenueDetail;
use Illuminate\Http\Request;

class TotalRevenueBreakdownController extends Controller
{
    public function index(Request $request)
    {
        $type = $request->query('type');
        $year = $request->query('year');
        $month = $request->query('month');

        if ($type === 'ytd') {

            $periodeIds = MPeriode::byYear($year)->pluck('id_periode');

            $sustain = FinanceRevenueDetail::whereIn('m_periode_id', $periodeIds)
                ->sum('ytd_realisasi_sustain');

            $scalling = FinanceRevenueDetail::whereIn('m_periode_id', $periodeIds)
                ->sum('ytd_realisasi_scalling');

        } else {

            $periodeId = MPeriode::byYearMonth($year, $month)->value('id_periode');

            $sustain = FinanceRevenueDetail::where('m_periode_id', $periodeId)
                ->sum('mtd_realisasi_sustain');

            $scalling = FinanceRevenueDetail::where('m_periode_id', $periodeId)
                ->sum('mtd_realisasi_scalling');
        }

        return response()->json([
            'status' => 'success',
            'data' => [
                'sustain' => $sustain,
                'scalling' => $scalling
            ]
        ]);
    }
}
