<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class SalesVsScalingRevenueController extends Controller
{
    public function index(Request $request)
    {
        $year = $request->year;

        $data = \App\Models\MPeriode::from('m_periode as p')
            ->leftJoin('finance_sales_detail as fs', function ($join) {
                $join->on('fs.m_periode_id', '=', 'p.id_periode')
                    ->where('fs.r_jenis_sales_id', 2);
            })
            ->leftJoin('finance_revenue_detail as fr', function ($join) {
                $join->on('fr.m_periode_id', '=', 'p.id_periode')
                    ->where('fr.r_jenis_revenue_id', 3);
            })
            ->where('p.tahun', $year)
            ->groupBy('p.bulan')
            ->orderBy('p.bulan')
            ->select(
                'p.bulan',
                DB::raw('SUM(fs.ytd_realisasi) AS sales'),
                DB::raw('SUM(fr.ytd_realisasi_scalling) AS revenue_scalling')
            )
            ->get();

        return response()->json($data);
    }
}

