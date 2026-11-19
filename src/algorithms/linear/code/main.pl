use strict;
use warnings;

sub linear_search {
    my ($data, $target) = @_;
    for my $i (0 .. $#$data) { # ⟦loop⟧
        if ($data->[$i] == $target) { # ⟦cmp⟧
            return $i; # ⟦found⟧
        }
    }
    return -1; # ⟦notfound⟧
}

my @data = (7, 3, 9, 4, 6, 2);
print linear_search(\@data, 4), "\n";
