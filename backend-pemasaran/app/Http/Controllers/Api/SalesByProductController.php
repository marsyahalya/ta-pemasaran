<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\MPeriode;
use App\Models\FinanceSalesDetail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class SalesByProductController extends Controller
{
    public function index(Request $request)
    {
        $type = $request->query('type');
        $year = $request->query('year');
        $month = $request->query('month');

        $periodeIds = MPeriode::byYear($year)->pluck('id_periode');

        $data = FinanceSalesDetail::query()
            ->where('r_jenis_sales_id', 3)
            ->whereIn('m_periode_id', $periodeIds)
            ->select(
                'nm_sales_detail as product_name',
                DB::raw('SUM(mtd_realisasi) as total_sales')
            )
            ->groupBy('nm_sales_detail')
            ->orderByDesc('total_sales')
            ->get();

        return response()->json([
            'status' => 'success',
            'data' => $data
        ]);
    }
}

