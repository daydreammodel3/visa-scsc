use strict;
use warnings;

sub selection_sort {
    my ($data) = @_;
    my $n = scalar @$data;
    for my $i (0 .. $n - 2) { # ⟦outer⟧
        my $min_index = $i; # ⟦setmin⟧
        for my $j ($i + 1 .. $n - 1) { # ⟦inner⟧
            if ($data->[$j] < $data->[$min_index]) { # ⟦cmp⟧
                $min_index = $j; # ⟦newmin⟧
            }
        }
        @$data[$i, $min_index] = @$data[$min_index, $i]; # ⟦swap⟧
    }
}

my @data = (6, 4, 9, 2, 7, 3);
selection_sort(\@data);
print "@data\n";
