use strict;
use warnings;

sub factorial { # ⟦call⟧
    my ($n) = @_;
    if ($n <= 1) { # ⟦base⟧
        return 1; # ⟦ret1⟧
    }
    return $n * factorial($n - 1); # ⟦rec,ret⟧
}

print factorial(4), "\n";
