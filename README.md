2021-2022 yıllarında geliştirdiğim hiç yapay zeka kullanmadan elimle yazdığım satranç projem. projenin tamamlanmış kodlarını kaybettim hocaya gönderdiğim maili de dosya tc'ye yüklemiştim silinmiş. şu anki hali 14 haftadan 6. haftadaki durumudur.

proxy server: docker üzerinde envoy çalışıyor. port ayarları grpc'ye göre ayarlanmıştır.

rpc: backend ve frontend için grpc dosyalarını üretmek için içerisinde proto dosyası bulunmaktadır

frontend ile ilgili açıklamalar

satranc.wasm backenddeki mantıkla benzer şekilde çalışıyor. onun dışında minimax tabanlı çok basit bir yapay zeka sistemi mevcuttur.

internette bulduğum bir blender satranç modelindeki tahtayı ve fazla taş tekrarlarını kaldırarak programlama ile dinamik hale getirdim.
