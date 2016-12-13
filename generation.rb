require 'date'
require 'json'
require 'nokogiri'

@table = Nokogiri::HTML(`curl 'http://www.polymtl.ca/registrariat/cours-et-programmes/horaires-des-examens-finaux-du-trimestre-dautonme-2016'`).at_css('table')
@year = 2016
@months = {
  "Décembre" => 12
}

def get_title(acronym)
  #Nokogiri::XML(`curl 'http://www.polymtl.ca/etudes/cours/utils/ficheXML.php?sigle=#{acronym}'`).xpath('//titre').text.strip
  "mock for speed, unmock me in get_title method"
end

# Hash creation
finals = @table.css('tr')[4..-1].each_with_index.map do |row, i|
  get_col = -> (n) {row.css('td')[n].content}
  date_temp = get_col[3].split
  month = @months[date_temp.pop]
  day = date_temp.pop.to_i
  ret = {
    id: i,
    acronym: get_col[0],
    title: get_title(get_col[0]),
    section: get_col[1],
    date: DateTime.new(@year, month, day, *get_col[4].split(':').map(&:to_i), 0, '-5').to_s,
    local: get_col[5],
  }
  ret[:names] = get_col[6].split(':').pop.strip.split(' à ').map do |fullname|
    fullname=fullname.split(', ').map &:strip
    { lastname: fullname.pop, firstname: fullname.pop }
  end.to_a unless get_col[6].strip.empty?
  ret
end

# Bounds creation
finals.length.times do |i|
  next if i==0
  if finals[i-1][:acronym] == finals[i][:acronym] and finals[i-1][:section] == finals[i][:section]
    finals[i-1][:upperBound] = finals[i][:names][0]
    finals[i][:lowerBound] = finals[i-1][:names][1]
  end
end


File.write("data.js","var finals ="+JSON.dump(finals))
