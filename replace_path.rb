DIST_FOLDER = __dir__ + "/dist"

# Found content script
Dir.chdir(DIST_FOLDER + "/scripts/")

filename = nil
Dir.glob("scripts.*.js") do |file|
    filename = DIST_FOLDER + "/scripts/" + file
end

abort("Content script not found.") if filename.nil?

# Edit images filename
num_modif = 0
data = File.read(filename)

Dir.chdir(DIST_FOLDER + "/images/")
updated_data = data.gsub(/(images\/\w+\/[^''""]*\.(png|jpg|jpeg|gif|webp|svg))/) do |str|
    newName = nil
    str.sub(/\/\w+.(png|jpg|jpeg|gif|webp|svg)/) do |substr|
        pattern = substr[/\w+\./] + "*" + substr[/\.(png|jpg|jpeg|gif|webp|svg)/]
        newName = Dir[pattern]
    end

    unless newName.nil? || newName.empty? then
        num_modif += 1
        "images/" + newName[0]
    end
end

# Edit assets
updated_data = updated_data.gsub(/assets\//, "files/") do
    num_modif += 1
end

File.open(filename, "w") do |f|
    f.write(updated_data)
end

puts num_modif.to_s + " element(s) updated. Screw you Grunt."