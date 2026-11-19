use strict;
use warnings;

sub insertion_sort {
    my ($data) = @_;
    for my $i (1 .. $#$data) { # ⟦outer⟧
        my $key = $data->[$i]; # ⟦key⟧
        my $j = $i - 1; # ⟦key⟧
        while ($j >= 0 && $data->[$j] > $key) { # ⟦cmp⟧
            $data->[$j + 1] = $data->[$j]; # ⟦shift⟧
            $j--; # ⟦shift⟧
        }
        $data->[$j + 1] = $key; # ⟦insert⟧
    }
}

my @data = (5, 3, 8, 1, 6, 2);
insertion_sort(\@data);
print "@data\n";
