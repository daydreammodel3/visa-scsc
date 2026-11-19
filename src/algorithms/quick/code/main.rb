def quick_sort(data, left, right) # ⟦call⟧
  if left < right # ⟦base⟧
    p = partition(data, left, right) # ⟦part,pdone⟧
    quick_sort(data, left, p - 1) # ⟦recL⟧
    quick_sort(data, p + 1, right) # ⟦recR⟧
  end
end

def partition(data, left, right) # ⟦pcall⟧
  pivot = data[right] # ⟦pivot⟧
  i = left - 1 # ⟦pivot⟧
  (left...right).each do |j| # ⟦pcmp⟧
    if data[j] <= pivot # ⟦pcmp⟧
      i += 1 # ⟦pswap⟧
      data[i], data[j] = data[j], data[i] # ⟦pswap⟧
    end
  end
  data[i + 1], data[right] = data[right], data[i + 1] # ⟦pfinal⟧
  i + 1 # ⟦pret⟧
end

data = [5, 2, 7, 1, 6, 3]
quick_sort(data, 0, data.length - 1)
puts data.join(" ")
