use strict;
use warnings;

sub bubble_sort {
    my ($data) = @_;
    for my $i (reverse 1 .. $#$data) { # ⟦outer⟧
        for my $j (0 .. $i - 1) { # ⟦inner⟧
            if ($data->[$j] > $data->[$j + 1]) { # ⟦cmp⟧
                @$data[$j, $j + 1] = @$data[$j + 1, $j]; # ⟦swap⟧
            }
        }
    }
}

my @data = (5, 3, 8, 1, 6, 2);
bubble_sort(\@data);
print "@data\n";
