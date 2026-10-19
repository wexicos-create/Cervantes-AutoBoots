# AiFavoApk 10 Ultra Plus — Gold Edition

Mobile companion for the Cervantes Autobots programming-workbench ecosystem.

## Included
- Kotlin + Jetpack Compose gold/obsidian interface.
- Local chat history in app-private storage.
- ZIP/APK/AAB file selection and local static inspection.
- Findings include severity, file and line, evidence, and suggested remediation.
- Archive inspection runs away from the UI thread, with size/entry/file bounds.
- No INTERNET permission; this APK does not connect external AI services and does not upload selected files.
- GitHub Actions builds a debug-signed APK for installation/testing.

## Accuracy
Inspection rules are heuristic and do not prove correctness. This build does not compile imported projects, execute their test suites, or certify they contain zero defects.

## Not yet connected
OpenCode, Mistral, Llama, NVIDIA, Qwen, Z.ai, GitHub/Vercel runtime integrations, and remote agent orchestration remain future modules. API pricing and quotas belong to each provider; unlimited remote inference and absolute anonymity cannot be guaranteed.

## Build
Android SDK Platform 35, JDK 17, Gradle 8.9:
`gradle assembleDebug`

APK: `app/build/outputs/apk/debug/app-debug.apk`
