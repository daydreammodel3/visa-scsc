class ListElement
  attr_accessor :val, :next

  def initialize(val)
    @val = val
    @next = nil
  end
end

$list_head = nil

def append(x)
  curr = ListElement.new(x) # ⟦new⟧
  if $list_head.nil? # ⟦empty⟧
    $list_head = curr # ⟦sethead⟧
  else
    prev = $list_head # ⟦walk0⟧
    until prev.next.nil? # ⟦walk⟧
      prev = prev.next # ⟦step⟧
    end
    prev.next = curr # ⟦link⟧
  end
end

def remove(x)
  prev = nil # ⟦rstart⟧
  curr = $list_head # ⟦rstart⟧
  until curr.nil? # ⟦rloop⟧
    if curr.val == x # ⟦rcmp⟧
      if prev.nil? # ⟦rhead⟧
        $list_head = curr.next # ⟦unhead⟧
      else
        prev.next = curr.next # ⟦unlink⟧
      end
      return # ⟦rdone⟧
    end
    prev = curr # ⟦radv⟧
    curr = curr.next # ⟦radv⟧
  end
end

[3, 8, 5, 1].each { |v| append(v) }
remove(8)

out = []
node = $list_head
until node.nil?
  out << node.val
  node = node.next
end
puts out.join(" ")
