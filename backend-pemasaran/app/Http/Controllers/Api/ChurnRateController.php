<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\MPeriode;

class ChurnRateController extends Controller
{
    public function index(Request $request)
    {
        $year = $request->query('year');
        $month = $request->query('month');
        $type = $request->query('type');

        if (!$year) {
            $year = date('Y');
        }

        $query = MPeriode::from('m_periode as p')
            ->leftJoin('churn_rate as c', 'c.m_periode', '=', 'p.id_periode')
            ->where('p.tahun', $year);

        if ($type === 'mtd' && $month) {
            $query->where('p.bulan', $month);
        } else {

        }

        $result = $query->select(
            DB::raw('AVG(c.churn_rate) as churn_rate')
        )->first();

        $churnRate = ($result && $result->churn_rate !== null) ? (float) $result->churn_rate : 0;

        if ($churnRate == 0) {
            $formatted = ($type === 'ytd') ? 'Data tidak tersedia' : '-';
        } else {
            $formatted = $churnRate;
        }

        return response()->json([
            'status' => 'success',
            'data' => [
                'churn_rate' => $formatted
            ]
        ]);
    }
}

