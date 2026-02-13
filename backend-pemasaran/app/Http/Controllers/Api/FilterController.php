<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\MPeriode;

class FilterController extends Controller
{
    public function getYears()
    {
        $years = MPeriode::select('tahun')
            ->distinct()
            ->orderBy('tahun', 'desc')
            ->pluck('tahun');

        return response()->json([
            'status' => 'success',
            'data' => $years
        ]);
    }

    public function getMonths(Request $request)
    {
        $year = $request->query('year');

        if (!$year) {
            return response()->json([
                'status' => 'error',
                'message' => 'Year parameter is required'
            ], 400);
        }

        $months = MPeriode::where('tahun', $year)
            ->select('bulan')
            ->distinct()
            ->orderBy('bulan', 'asc')
            ->pluck('bulan');

        return response()->json([
            'status' => 'success',
            'data' => $months
        ]);
    }
}
