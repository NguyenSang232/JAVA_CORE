const animals = [
  {
    id: 1,
    name: "Jaguar",
    habitat: "Forests, Grasslands, Wetlands",
    diet: "Carnivore",
    size: "1.1–1.8 m, 56–96 kg",
    lifespan: "12–15 years",
    conservationStatus: "Near Threatened",
   image: "https://images.unsplash.com/photo-1546182990-dffeafbe841d?auto=format&fit=crop&w=600&q=80",// Ảnh báo đốm Jaguar chuẩn
    description: "The jaguar is the largest cat species native to the Americas and one of the strongest predators in the rainforest. Its distinctive golden coat with black rosettes provides excellent camouflage among dense vegetation. Jaguars are solitary hunters that use powerful jaws to capture prey such as deer, peccaries, and caimans."
  },
  {
    id: 2,
    name: "African Elephant",
    habitat: "Savannas, Forests",
    diet: "Herbivore",
    size: "3–4 m, 4000–7000 kg",
    lifespan: "60–70 years",
    conservationStatus: "Endangered",
    image: "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=600&q=80",
    description: "African elephants are the largest land animals on Earth and play an important role in maintaining ecosystems. They live in family groups led by experienced females called matriarchs. Their intelligence, strong memory, and social behavior make them one of the most remarkable species in the animal kingdom."
  },
  {
    id: 3,
    name: "Tiger",
    habitat: "Forests, Grasslands",
    diet: "Carnivore",
    size: "2.5–3.3 m, 90–310 kg",
    lifespan: "10–15 years",
    conservationStatus: "Endangered",
    image: "https://images.unsplash.com/photo-1561731216-c3a4d99437d5?auto=format&fit=crop&w=600&q=80",
    description: "The tiger is the largest member of the cat family and is famous for its striking orange coat with black stripes. It is a powerful solitary predator that hunts deer, wild boar, and other large animals. Habitat destruction and illegal poaching remain major threats to wild tiger populations."
  },
  {
    id: 4,
    name: "Lion",
    habitat: "Savannas",
    diet: "Carnivore",
    size: "1.7–2.5 m, 120–250 kg",
    lifespan: "10–14 years",
    conservationStatus: "Vulnerable",
    image: "https://images.unsplash.com/photo-1546182990-dffeafbe841d?auto=format&fit=crop&w=600&q=80",
    description: "Lions are unique among big cats because they live in social groups known as prides. These powerful predators are found mainly in African grasslands and savannas. Lions work together when hunting and rely on teamwork to capture large prey such as zebras and wildebeest."
  },
  {
    id: 5,
    name: "Polar Bear",
    habitat: "Arctic",
    diet: "Carnivore",
    size: "2–3 m, 350–700 kg",
    lifespan: "20–25 years",
    conservationStatus: "Vulnerable",
    image: "https://images.unsplash.com/photo-1589656966895-2f33e7653819?auto=format&fit=crop&w=600&q=80",
    description: "Polar bears are highly specialized predators that inhabit the icy regions of the Arctic. Their thick fur and layer of body fat help them survive in extremely cold temperatures. Climate change and melting sea ice pose significant challenges to the future of polar bear populations."
  },
  {
    id: 6,
    name: "Giant Panda",
    habitat: "Mountain Forests",
    diet: "Herbivore",
    size: "1.2–1.9 m, 70–120 kg",
    lifespan: "20 years",
    conservationStatus: "Vulnerable",
    image: "https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?auto=format&fit=crop&w=600&q=80",
    description: "The giant panda is famous for its black-and-white fur and peaceful appearance. Although classified as a carnivore, it feeds almost entirely on bamboo. Conservation efforts have helped increase panda numbers, making it a global symbol of wildlife protection."
  },
  {
    id: 7,
    name: "Koala",
    habitat: "Eucalyptus Forests",
    diet: "Herbivore",
    size: "60–85 cm, 4–15 kg",
    lifespan: "13–18 years",
    conservationStatus: "Vulnerable",
    image: "https://images.unsplash.com/photo-1526481280693-3bfa7568e0f3?auto=format&fit=crop&w=600&q=80",
    description: "Koalas are tree-dwelling marsupials native to Australia and spend most of their lives in eucalyptus trees. They sleep for many hours each day to conserve energy from their low-nutrient diet. Habitat loss and bushfires continue to threaten koala populations."
  },
  {
    id: 8,
    name: "Gray Wolf",
    habitat: "Forests, Mountains",
    diet: "Carnivore",
    size: "1–1.6 m, 30–80 kg",
    lifespan: "8–13 years",
    conservationStatus: "Least Concern",
    image: "https://images.unsplash.com/photo-1533743983669-94fa5c4338ec?auto=format&fit=crop&w=600&q=80",
    description: "Gray wolves are intelligent predators that live and hunt in organized packs. Their communication system includes howling, body language, and scent marking. Wolves play an important ecological role by helping control populations of large herbivores."
  },
  {
    id: 9,
    name: "Red Fox",
    habitat: "Forests, Grasslands",
    diet: "Omnivore",
    size: "45–90 cm, 3–14 kg",
    lifespan: "3–5 years",
    conservationStatus: "Least Concern",
    image: "https://images.unsplash.com/photo-1474511320723-9a56873867b5?auto=format&fit=crop&w=600&q=80",
    description: "The red fox is one of the most adaptable mammals and can be found in a wide range of habitats. It is an opportunistic feeder that consumes small animals, fruits, insects, and human food waste. Its intelligence and flexibility have allowed it to thrive around the world."
  },
  {
    id: 10,
    name: "Bald Eagle",
    habitat: "Rivers, Lakes",
    diet: "Carnivore",
    size: "70–100 cm, 3–6 kg",
    lifespan: "20–30 years",
    conservationStatus: "Least Concern",
    image: "https://images.unsplash.com/photo-1611689342806-0863700ce1e4?auto=format&fit=crop&w=600&q=80",
    description: "The bald eagle is a powerful bird of prey recognized by its white head and dark brown body. It primarily feeds on fish and is commonly found near large bodies of water. Successful conservation efforts have helped this iconic species recover from previous population declines."
  },
  {
    id: 11,
    name: "Penguin",
    habitat: "Antarctic Coast",
    diet: "Carnivore",
    size: "40–120 cm",
    lifespan: "15–20 years",
    conservationStatus: "Least Concern",
    image: "https://images.unsplash.com/photo-1517783999520-f068d7431a60?auto=format&fit=crop&w=600&q=80",
    description: "Penguins are flightless birds specially adapted for life in cold marine environments. Their streamlined bodies and strong flippers make them excellent swimmers. They rely on fish, squid, and krill as their primary food sources."
  },
  {
    id: 12,
    name: "Dolphin",
    habitat: "Oceans",
    diet: "Carnivore",
    size: "2–4 m",
    lifespan: "20–50 years",
    conservationStatus: "Least Concern",
    image: "https://images.unsplash.com/photo-1607153333879-c174d265f1d2?auto=format&fit=crop&w=600&q=80",
    description: "Dolphins are highly intelligent marine mammals known for their playful behavior and advanced communication skills. They use echolocation to navigate and locate prey underwater. Dolphins often live in social groups and cooperate while hunting."
  },
  {
    id: 13,
    name: "Blue Whale",
    habitat: "Open Ocean",
    diet: "Carnivore",
    size: "24–30 m",
    lifespan: "80–90 years",
    conservationStatus: "Endangered",
    image: "https://images.unsplash.com/photo-1546182990-dffeafbe841d?auto=format&fit=crop&w=600&q=80",
    description: "The blue whale is the largest animal ever known to have lived on Earth. Despite its enormous size, it feeds mainly on tiny crustaceans called krill. Its deep vocalizations can travel great distances across the ocean."
  },
  {
    id: 14,
    name: "Komodo Dragon",
    habitat: "Dry Forests",
    diet: "Carnivore",
    size: "2–3 m",
    lifespan: "30 years",
    conservationStatus: "Endangered",
    image: "https://images.unsplash.com/photo-1603184017968-953f59cd2e37?auto=format&fit=crop&w=600&q=80",
    description: "The Komodo dragon is the world's largest living lizard and is found only on a few Indonesian islands. It is a powerful predator capable of hunting deer, wild pigs, and other animals. Habitat limitations make the species vulnerable to environmental changes."
  },
  {
    id: 15,
    name: "King Cobra",
    habitat: "Rainforests",
    diet: "Carnivore",
    size: "3–5.5 m",
    lifespan: "20 years",
    conservationStatus: "Vulnerable",
    image: "https://images.unsplash.com/photo-1546182990-dffeafbe841d?auto=format&fit=crop&w=600&q=80",
    description: "The king cobra is the longest venomous snake in the world and is widely respected for its impressive size. Unlike many snakes, it primarily feeds on other snakes. When threatened, it raises its body and spreads its hood as a warning display."
  },
  {
    id: 16,
    name: "Crocodile",
    habitat: "Rivers, Wetlands",
    diet: "Carnivore",
    size: "3–6 m",
    lifespan: "50–70 years",
    conservationStatus: "Least Concern",
    image: "https://images.unsplash.com/photo-1546182990-dffeafbe841d?auto=format&fit=crop&w=600&q=80",
    description: "Crocodiles are ancient reptiles that have existed for millions of years with little change. They are ambush predators that wait patiently before attacking prey near the water's edge. Their strong jaws and armored bodies make them highly effective hunters."
  },
  {
    id: 17,
    name: "Gorilla",
    habitat: "Tropical Forests",
    diet: "Herbivore",
    size: "1.4–1.8 m, 140–220 kg",
    lifespan: "35–40 years",
    conservationStatus: "Critically Endangered",
    image: "https://images.unsplash.com/photo-1546182990-dffeafbe841d?auto=format&fit=crop&w=600&q=80", 
    description: "Gorillas are the largest living primates and share much of their genetic makeup with humans. They live in family groups led by a dominant silverback male. Gorillas are generally peaceful animals that spend most of their time feeding on plants."
  },
  {
    id: 18,
    name: "Orangutan",
    habitat: "Rainforests",
    diet: "Omnivore",
    size: "1.2–1.5 m",
    lifespan: "30–40 years",
    conservationStatus: "Critically Endangered",
    image: "https://images.unsplash.com/photo-1501705388883-4ed8a543392c?auto=format&fit=crop&w=600&q=80",
    description: "Orangutans are highly intelligent great apes found in the rainforests of Southeast Asia. They spend much of their lives in trees and use tools to obtain food. Deforestation remains one of the greatest threats to their survival."
  },
  {
    id: 19,
    name: "Zebra",
    habitat: "Savannas",
    diet: "Herbivore",
    size: "2–2.5 m",
    lifespan: "20–25 years",
    conservationStatus: "Near Threatened",
    image: "https://images.unsplash.com/photo-1546182990-dffeafbe841d?auto=format&fit=crop&w=600&q=80",
    description: "Zebras are easily recognized by their distinctive black-and-white striped coats. These social animals often travel in herds for protection against predators. Each zebra has a unique stripe pattern, similar to a human fingerprint."
  },
  {
    id: 20,
    name: "Giraffe",
    habitat: "Savannas",
    diet: "Herbivore",
    size: "4.5–6 m",
    lifespan: "20–25 years",
    conservationStatus: "Vulnerable",
    image: "https://images.unsplash.com/photo-1547721064-da6cfb341d50?auto=format&fit=crop&w=600&q=80",
    description: "Giraffes are the tallest land animals and use their long necks to reach leaves high in trees. They are well adapted to life in African savannas and can travel long distances in search of food. Habitat loss and declining populations have increased conservation concerns."
  }
];