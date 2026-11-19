use strict;
use warnings;

sub quick_sort { # ⟦call⟧
    my ($data, $left, $right) = @_;
    if ($left < $right) { # ⟦base⟧
        my $p = partition($data, $left, $right); # ⟦part,pdone⟧
        quick_sort($data, $left, $p - 1); # ⟦recL⟧
        quick_sort($data, $p + 1, $right); # ⟦recR⟧
    }
}

sub partition { # ⟦pcall⟧
    my ($data, $left, $right) = @_;
    my $pivot = $data->[$right]; # ⟦pivot⟧
    my $i = $left - 1; # ⟦pivot⟧
    for my $j ($left .. $right - 1) { # ⟦pcmp⟧
        if ($data->[$j] <= $pivot) { # ⟦pcmp⟧
            $i++; # ⟦pswap⟧
            @$data[$i, $j] = @$data[$j, $i]; # ⟦pswap⟧
        }
    }
    @$data[$i + 1, $right] = @$data[$right, $i + 1]; # ⟦pfinal⟧
    return $i + 1; # ⟦pret⟧
}

my @data = (5, 3, 8, 1, 6, 2);
quick_sort(\@data, 0, $#data);
print "@data\n";
