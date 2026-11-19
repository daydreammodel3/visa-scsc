use strict;
use warnings;

# 要素は { val => 値, next => 次の要素への参照 } のハッシュリファレンス
my $list_head = undef;

sub append {
    my ($x) = @_;
    my $curr = { val => $x, next => undef }; # ⟦new⟧
    if (!defined $list_head) { # ⟦empty⟧
        $list_head = $curr; # ⟦sethead⟧
    } else {
        my $prev = $list_head; # ⟦walk0⟧
        while (defined $prev->{next}) { # ⟦walk⟧
            $prev = $prev->{next}; # ⟦step⟧
        }
        $prev->{next} = $curr; # ⟦link⟧
    }
}

sub remove {
    my ($x) = @_;
    my $prev = undef; # ⟦rstart⟧
    my $curr = $list_head; # ⟦rstart⟧
    while (defined $curr) { # ⟦rloop⟧
        if ($curr->{val} == $x) { # ⟦rcmp⟧
            if (!defined $prev) { # ⟦rhead⟧
                $list_head = $curr->{next}; # ⟦unhead⟧
            } else {
                $prev->{next} = $curr->{next}; # ⟦unlink⟧
            }
            return; # ⟦rdone⟧
        }
        $prev = $curr; # ⟦radv⟧
        $curr = $curr->{next}; # ⟦radv⟧
    }
}

append($_) for (3, 8, 5, 1);
remove(8);

my @out;
for (my $node = $list_head; defined $node; $node = $node->{next}) {
    push @out, $node->{val};
}
print "@out\n";
