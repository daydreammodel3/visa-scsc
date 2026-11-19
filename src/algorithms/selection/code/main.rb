def selection_sort(data)
  n = data.length
  (0...n - 1).each do |i| # ⟦outer⟧
    min_index = i # ⟦setmin⟧
    (i + 1...n).each do |j| # ⟦inner⟧
      if data[j] < data[min_index] # ⟦cmp⟧
        min_index = j # ⟦newmin⟧
      end
    end
    data[i], data[min_index] = data[min_index], data[i] # ⟦swap⟧
  end
end

data = [6, 4, 9, 2, 7, 3]
selection_sort(data)
puts data.join(" ")
