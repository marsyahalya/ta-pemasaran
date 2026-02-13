<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\MPeriode;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class RevenueBySegmentController extends Controller
{
    public function index(Request $request)
    {
        $type = $request->query('type');
        $year = $request->query('year');
        $month = $request->query('month');

        $periodeIds = MPeriode::byYear($year)->pluck('id_periode');

        $data = \App\Models\FinanceRevenueDetail::whereIn('m_periode_id', $periodeIds)
            ->where('r_jenis_revenue_id', 3)
            ->select(
                'r_segmen_id as segment',
                DB::raw('SUM(mtd_realisasi_sustain)  as sustain'),
                DB::raw('SUM(mtd_realisasi_scalling) as scalling'),
                DB::raw('SUM(mtd_realisasi_sustain + mtd_realisasi_scalling) as total')
            )
            ->groupBy('r_segmen_id')
            ->orderBy('r_segmen_id')
            ->get();

        return response()->json([
            'status' => 'success',
            'data' => $data
        ]);
    }
}

