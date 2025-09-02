import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import { PostService } from "../src/services/PostService";
import PostCard from "../src/components/PostCard";

export default function SocialFeedScreen() {
  const [posts, setPosts] = useState([]);
  const [content, setContent] = useState("");
  const [media, setMedia] = useState("");

  const load = async () => {
    try {
      const res = await PostService.feed({ skip: 0, limit: 20 });
      setPosts(res.data || []);
    } catch (e) {
      setPosts([]);
    }
  };

  const create = async () => {
    if (!content.trim()) return Alert.alert("Info", "Le contenu est vide");
    try {
      await PostService.create({ content, media_url: media || null });
      setContent("");
      setMedia("");
      await load();
    } catch (e) {
      Alert.alert("Erreur", "Impossible de créer le post");
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <View
        style={{
          backgroundColor: "#fff",
          padding: 12,
          borderRadius: 12,
          marginBottom: 12,
        }}
      >
        <Text style={{ fontWeight: "700", marginBottom: 8 }}>
          Créer un post
        </Text>
        <TextInput
          placeholder="Votre message..."
          value={content}
          onChangeText={setContent}
          style={{
            backgroundColor: "#f3f4f6",
            padding: 10,
            borderRadius: 8,
            marginBottom: 8,
          }}
        />
        <TextInput
          placeholder="Media URL (optionnel)"
          value={media}
          onChangeText={setMedia}
          style={{
            backgroundColor: "#f3f4f6",
            padding: 10,
            borderRadius: 8,
            marginBottom: 8,
          }}
        />
        <TouchableOpacity
          onPress={create}
          style={{ backgroundColor: "#111827", padding: 12, borderRadius: 10 }}
        >
          <Text
            style={{ color: "#fff", textAlign: "center", fontWeight: "600" }}
          >
            Publier
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={posts}
        keyExtractor={(item, idx) => String(item.id || idx)}
        renderItem={({ item }) => <PostCard item={item} onChanged={load} />}
        onRefresh={load}
        refreshing={false}
      />
    </View>
  );
}
