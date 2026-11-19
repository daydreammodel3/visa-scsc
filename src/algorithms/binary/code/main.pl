use strict;
use warnings;

sub binary_search {
    my ($data, $target) = @_;
    my $low = 0; # ⟦init⟧
    my $high = $#$data; # ⟦init⟧
    while ($low <= $high) { # ⟦loop⟧
        my $mid = int(($low + $high) / 2); # ⟦mid⟧
        if ($data->[$mid] == $target) { # ⟦cmp⟧
            return $mid; # ⟦found⟧
        } elsif ($data->[$mid] < $target) { # ⟦lt⟧
            $low = $mid + 1; # ⟦right⟧
        } else {
            $high = $mid - 1; # ⟦left⟧
        }
    }
    return -1; # ⟦notfound⟧
}

my @data = (2, 5, 8, 12, 16, 23, 38, 56, 72, 91);
print binary_search(\@data, 23), "\n";
