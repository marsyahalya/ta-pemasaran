<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\MPeriode;

class SalesCycleLengthController extends Controller
{
    public function index(Request $request)
    {
        $year = $request->query('year');

        $query = MPeriode::from('m_periode')
            ->join('commerce_scl', 'commerce_scl.m_periode_id', '=', 'm_periode.id_periode')
            ->select(
                'm_periode.tahun',
                'm_periode.bulan',
                DB::raw('SUM(commerce_scl.days_duration * commerce_scl.count_f5) / SUM(commerce_scl.count_f5) AS avg_days')
            );

        if ($year) {
            $query->where('m_periode.tahun', $year);
        }

        $data = $query
            ->groupBy('m_periode.tahun', 'm_periode.bulan')
            ->orderBy('m_periode.tahun')
            ->orderBy('m_periode.bulan')
            ->get();

        return response()->json([
            'status' => 'success',
            'data' => $data
        ]);
    }
}

