<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MPeriode extends Model
{
    protected $table = 'm_periode';
    protected $primaryKey = 'id_periode';
    public $timestamps = false;
    public function scopeByYear($query, $year)
    {
        return $query->where('tahun', $year);
    }

    public function scopeByYearMonth($query, $year, $month)
    {
        return $query->where('tahun', $year)->where('bulan', $month);
    }
}
