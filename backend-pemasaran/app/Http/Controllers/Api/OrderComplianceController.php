<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\MPeriode;

class OrderComplianceController extends Controller
{
    public function index(Request $request)
    {
        $year = $request->query('year');
        $month = $request->query('month');
        $type = $request->query('type');

        if (!$year) {
            $year = 2025;
        }

        $query = MPeriode::from('m_periode as p')
            ->leftJoin('commerce as c', 'c.m_periode_id', '=', 'p.id_periode')
            ->where('p.tahun', $year);

        if ($type === 'mtd' && $month) {
            $query->where('p.bulan', $month);
        } else {
        }

        $result = $query->select(
            DB::raw('SUM(c.nominal) as order_compliance')
        )->first();

        $compliance = ($result && $result->order_compliance !== null) ? (float) $result->order_compliance : 0;

        if ($compliance == 0) {
            $formatted = ($type === 'ytd' || !$month) ? 'Data tidak tersedia' : '-';
        } else {
            $formatted = $compliance;
        }

        return response()->json([
            'status' => 'success',
            'data' => [
                'order_compliance' => $formatted
            ]
        ]);
    }
}

