<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use App\Models\MPeriode;
use App\Models\CommerceDetailSar;

class SalesAdequacyRatioController extends Controller
{
    public function index(Request $request)
    {
        $year = $request->query('year');
        $month = $request->query('month');
        $type = $request->query('type');

        if ($type === 'mtd' && $month) {
            $periodeId = MPeriode::byYearMonth($year, $month)->value('id_periode');

            if (!$periodeId) {
                return response()->json([
                    'status' => 'success',
                    'data' => []
                ]);
            }

            $data = CommerceDetailSar::where('m_periode_id', $periodeId)
                ->select(
                    'funnel',
                    DB::raw('SUM(value) as sales_adequacy_value')
                )
                ->groupBy('funnel')
                ->orderBy('funnel')
                ->get();
        } else {
            $periodeIds = MPeriode::byYear($year)->pluck('id_periode');

            if ($periodeIds->isEmpty()) {
                return response()->json([
                    'status' => 'success',
                    'data' => []
                ]);
            }

            $data = CommerceDetailSar::whereIn('m_periode_id', $periodeIds)
                ->select(
                    'funnel',
                    DB::raw('SUM(value) as sales_adequacy_value')
                )
                ->groupBy('funnel')
                ->orderBy('funnel')
                ->get();
        }

        return response()->json([
            'status' => 'success',
            'data' => $data
        ]);
    }
}

