def bubble_sort(data)
  (data.length - 1).downto(1) do |i| # ⟦outer⟧
    (0...i).each do |j| # ⟦inner⟧
      if data[j] > data[j + 1] # ⟦cmp⟧
        data[j], data[j + 1] = data[j + 1], data[j] # ⟦swap⟧
      end
    end
  end
end

data = [5, 3, 8, 1, 4]
bubble_sort(data)
puts data.join(" ")
