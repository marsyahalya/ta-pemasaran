<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use App\Models\MPeriode;
use App\Models\CommerceScr;

class SalesConversionRatioController extends Controller
{
    public function index(Request $request)
    {
        $year = $request->query('year');
        $month = $request->query('month');
        $type = $request->query('type');

        if (!$year) {
            return response()->json([
                'status' => 'error',
                'message' => 'year is required'
            ], 400);
        }

        if ($type === 'mtd' && $month) {
            $periodeId = MPeriode::byYearMonth($year, $month)->value('id_periode');

            $result = CommerceScr::where('m_periode_id', $periodeId)
                ->selectRaw('
                    CASE 
                        WHEN SUM(sum_f2) = 0 THEN 0
                        ELSE SUM(sum_f5) / SUM(sum_f2)
                    END AS sales_conversion_ratio
                ')
                ->first();
        } else {
            $periodeIds = MPeriode::byYear($year)->pluck('id_periode');

            $result = CommerceScr::whereIn('m_periode_id', $periodeIds)
                ->selectRaw('
                    CASE 
                        WHEN SUM(sum_f2) = 0 THEN 0
                        ELSE SUM(sum_f5) / SUM(sum_f2)
                    END AS sales_conversion_ratio
                ')
                ->first();
        }

        $ratio = ($result && $result->sales_conversion_ratio !== null) ? round($result->sales_conversion_ratio * 100, 2) : 0;

        if ($ratio == 0) {
            $formatted = ($type === 'ytd' || !$month) ? 'Data tidak tersedia' : '-';
        } else {
            $formatted = $ratio;
        }

        return response()->json([
            'status' => 'success',
            'data' => [
                'sales_conversion_ratio' => $formatted
            ]
        ]);
    }
}

