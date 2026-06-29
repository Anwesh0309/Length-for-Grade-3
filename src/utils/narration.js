import { say, ask, cheer, emphasize, think, celebrate, instruct, encourage } from './audio.js';

export function introNarration() {
  return [
    encourage("One rainy afternoon, Maya, Jake, and Sofia found a rolled-up map tucked behind the oldest book in the school library."),
    say("It showed a mysterious island — and a note that said: Only those who understand the language of length shall find the treasure."),
    ask("Maya looked up and whispered — do you know how to measure things?"),
  ];
}

export function wonderNarration() {
  return [
    say("Jake pulled out his notebook. We will need to measure everything, he said."),
    think("But Sofia asked — what IS length, anyway? And how do people measure it all around the world?"),
  ];
}

export function station1Narration() {
  return [
    say("Sofia picked up a tiny ruler and pressed it against a wooden pencil."),
    emphasize("You always start from zero! Sam reminded her, tapping the left end of the ruler."),
    instruct("Ten millimetres make one centimetre. Watch carefully where the pencil ends on the ruler."),
  ];
}

export function station2Narration() {
  return [
    encourage("This ruler is too small! Jake said, staring at the giant sunflower."),
    say("Lena laughed and handed him a long metre stick. One hundred centimetres — that is one full metre!"),
    instruct("For long objects, we use metres. For shorter ones, centimetres work best."),
  ];
}

export function station3Narration() {
  return [
    say("Sometimes you cannot carry a ruler everywhere, Omar said with a grin, pulling his hand from his pocket."),
    encourage("That is why great explorers always carry their best measuring tool — their own body!"),
    instruct("Your finger is about one centimetre wide. Your hand span is about fifteen to twenty centimetres. A door is roughly two metres tall."),
  ];
}

export function station4Narration() {
  return [
    say("Chen needed exactly two hundred and fifty centimetres of rope to finish the bridge."),
    say("But the hardware store sells rope in metres, he sighed."),
    emphasize("Jake flipped open his notebook. That is two metres and fifty centimetres! he announced proudly."),
    instruct("To convert metres to centimetres, multiply by one hundred. To go the other way, divide by one hundred."),
  ];
}

export function station5Narration() {
  return [
    say("Aisha had jumped one hundred and forty-five centimetres. Marco jumped one metre and fifty-two centimetres."),
    think("Sofia scratched her head — who jumped further?"),
    emphasize("You need to use the same unit before comparing! Aisha called out."),
  ];
}

export function station6Narration() {
  return [
    say("The final clue said: The path to the treasure has three sections."),
    say("The first section is forty-five metres long. The second is twice as long. The third is thirty metres shorter than the second."),
    ask("How long is the whole path? Maya looked at her friends and smiled — we have got this."),
  ];
}

export function reflectNarration() {
  return [
    say("Maya smiled and said — always start your ruler from zero, and read in millimetres and centimetres for small objects."),
    say("Jake added — one metre equals one hundred centimetres. Use metres for longer lengths like rooms and roads."),
    think("Sofia thought out loud — when you estimate, use your body as a guide. Your finger, your hand, your arm."),
    instruct("To convert, multiply by one hundred to go from metres to centimetres, and divide by one hundred to go back."),
    emphasize("Before comparing lengths, make sure they are all in the same unit!"),
    encourage("And for word problems, always figure out what you are looking for first, then calculate step by step."),
  ];
}

export function practiceCorrectNarration() {
  return [cheer("Brilliant! You got it right!")];
}

export function practiceIncorrectNarration() {
  return [encourage("Great try! Let us look at this together.")];
}

export function celebrationNarration() {
  return [
    celebrate("The treasure chest burst open — and inside were not gold coins, but something even better."),
    celebrate("A certificate that read: Length Legend — awarded to the brave explorer who mastered the art of measurement!"),
    encourage("Maya, Jake, and Sofia cheered — and so did you. You are a true Length Legend!"),
  ];
}
