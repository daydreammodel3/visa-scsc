use strict;
use warnings;

sub merge_sort { # ⟦call⟧
    my ($data, $tmp, $left, $right) = @_;
    if ($left >= $right) { # ⟦base⟧
        return; # ⟦leaf⟧
    }
    my $mid = int(($left + $right) / 2); # ⟦mid⟧
    merge_sort($data, $tmp, $left, $mid); # ⟦recL⟧
    merge_sort($data, $tmp, $mid + 1, $right); # ⟦recR⟧
    my $i = $left; # ⟦mstart⟧
    my $j = $mid + 1; # ⟦mstart⟧
    my $k = $left; # ⟦mstart⟧
    while ($i <= $mid && $j <= $right) { # ⟦mcmp⟧
        if ($data->[$i] <= $data->[$j]) { # ⟦mcmp⟧
            $tmp->[$k] = $data->[$i]; # ⟦takeL⟧
            $i++; # ⟦takeL⟧
        } else {
            $tmp->[$k] = $data->[$j]; # ⟦takeR⟧
            $j++; # ⟦takeR⟧
        }
        $k++; # ⟦takeL,takeR⟧
    }
    while ($i <= $mid) { # ⟦restL⟧
        $tmp->[$k] = $data->[$i]; # ⟦restL⟧
        $i++; # ⟦restL⟧
        $k++; # ⟦restL⟧
    }
    while ($j <= $right) { # ⟦restR⟧
        $tmp->[$k] = $data->[$j]; # ⟦restR⟧
        $j++; # ⟦restR⟧
        $k++; # ⟦restR⟧
    }
    for my $k ($left .. $right) { # ⟦copy⟧
        $data->[$k] = $tmp->[$k]; # ⟦copy⟧
    }
}

my @data = (6, 3, 8, 1, 5, 2);
my @tmp = (undef) x @data;
merge_sort(\@data, \@tmp, 0, $#data);
print "@data\n";
