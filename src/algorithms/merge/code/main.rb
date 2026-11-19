def merge_sort(data, tmp, left, right) # ⟦call⟧
  if left >= right # ⟦base⟧
    return # ⟦leaf⟧
  end
  mid = (left + right) / 2 # ⟦mid⟧
  merge_sort(data, tmp, left, mid) # ⟦recL⟧
  merge_sort(data, tmp, mid + 1, right) # ⟦recR⟧
  i = left # ⟦mstart⟧
  j = mid + 1 # ⟦mstart⟧
  k = left # ⟦mstart⟧
  while i <= mid && j <= right # ⟦mcmp⟧
    if data[i] <= data[j] # ⟦mcmp⟧
      tmp[k] = data[i] # ⟦takeL⟧
      i += 1 # ⟦takeL⟧
    else
      tmp[k] = data[j] # ⟦takeR⟧
      j += 1 # ⟦takeR⟧
    end
    k += 1 # ⟦takeL,takeR⟧
  end
  while i <= mid # ⟦restL⟧
    tmp[k] = data[i] # ⟦restL⟧
    i += 1 # ⟦restL⟧
    k += 1 # ⟦restL⟧
  end
  while j <= right # ⟦restR⟧
    tmp[k] = data[j] # ⟦restR⟧
    j += 1 # ⟦restR⟧
    k += 1 # ⟦restR⟧
  end
  (left..right).each do |k| # ⟦copy⟧
    data[k] = tmp[k] # ⟦copy⟧
  end
end

data = [6, 3, 8, 1, 5, 2]
tmp = Array.new(data.length)
merge_sort(data, tmp, 0, data.length - 1)
puts data.join(" ")
