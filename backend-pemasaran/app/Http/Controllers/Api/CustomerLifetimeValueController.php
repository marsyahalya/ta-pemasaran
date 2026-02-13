<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\MPeriode;

class CustomerLifetimeValueController extends Controller
{
    public function index(Request $request)
    {
        $year = $request->query('year');

        $query = MPeriode::from('m_periode as p')
            ->join('cust_lifetime_val as clv', 'p.id_periode', '=', 'clv.m_periode_id')
            ->select(
                'p.tahun',
                'p.bulan',
                DB::raw('AVG(clv.clv) as clv')
            );

        if ($year) {
            $query->where('p.tahun', $year);
        }

        $data = $query
            ->groupBy('p.tahun', 'p.bulan')
            ->orderBy('p.tahun')
            ->orderBy('p.bulan')
            ->get();

        return response()->json([
            'status' => 'success',
            'data' => $data
        ]);
    }
}

