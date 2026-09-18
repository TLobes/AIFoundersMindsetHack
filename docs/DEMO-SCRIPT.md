# Otter Coach demo

## What it does

Otter Coach is a bilingual customer-service rehearsal. Practise responding to a frustrated fictional cafe customer, then review feedback against five visible policy criteria. All amounts, people, and policies are fictional training examples.

The current no-key mode is guided practice: deterministic conversation and rule-based feedback. Browser speech is optional. Do not present it as live model reasoning. Devin is the AI engineering agent used to build and test the application. An optional server-side Gemini adapter can provide live AI when configured and tested.

## 90-second presentation

0-15s: "Your first difficult customer should be an otter. Otter Coach lets support teams practise before they handle a real complaint."

15-30s: Start the double-charge scenario. Show the policy drawer so the audience can see what good handling means.

30-55s: Respond to the customer. Use the sample good responses below if typing on stage is slow. If browser speech works, play a short customer line; keep subtitles visible.

55-75s: Finish and show feedback with exact trainee quotations. Explain that the current guided version checks policy skills, and that it is training feedback rather than an employment assessment.

75-90s: Show the actual Devin session/PR. "Devin implemented the browser app and tests in its own environment. I supplied the product brief and reviewed the result. This demo runs without a paid conversation API; a live model adapter is the next mode to enable."

## English sample

1. "I'm sorry - that sounds frustrating. Are both entries completed, or does one say pending?"
2. "A pending entry may be an authorization, so it isn't proof of a second completed charge. I can't promise a refund before we check."
3. "If both charges are posted, please share your receipt reference through our support channel and we'll escalate for review. Does that next step make sense?"

## Japanese sample

1. "ご心配をおかけして申し訳ありません。両方とも確定していますか。それとも片方は保留中ですか。"
2. "保留中の表示は仮承認の場合があり、二重に確定した証拠ではありません。確認前に返金をお約束することはできません。"
3. "両方とも確定している場合は、サポート窓口でレシートの参照番号をお知らせください。担当者に確認を依頼します。この次の手順でよろしいでしょうか。"

## Deliberately weak response

"You'll get a refund immediately. Give me your card number and PIN."

The review should flag the unsupported promise and unsafe information request. Do not enter actual payment details. Guided scoring has language-detection limitations; present it as coaching cues, not a robust semantic evaluation model.

## Before judges arrive

- Keep the browser already open and voice playback off until needed.
- Complete one session in both languages and reset to the start screen.
- Keep typed input available if microphone permissions or speech recognition fail.
- Keep the Devin session and PR in another tab.
- Confirm the actual submission deadline; the supplied playbook says 19:55 JST.

## ElevenLabs later

The event playbook describes a free Creator month via the [ElevenLabs Discord](https://discord.com/invite/VnBvbbcdEC), coupon-codes channel, selecting AI Founders Mindset Hackathon #001 with the Luma registration email. Redemption is performed by the participant.

After redemption, create a restricted key under Developers → API Keys. Enable only needed speech access and set a credit limit. Store it in ignored local environment configuration, not in the browser bundle or repository. [Official instructions](https://help.elevenlabs.io/hc/en-us/articles/14599447207697-How-do-I-authorize-myself-using-an-API-key).
