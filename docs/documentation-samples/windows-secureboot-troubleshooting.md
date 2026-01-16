---
title: "Troubleshooting: 'This PC can't run Windows 11' (Secure Boot Error)"
category: "Troubleshooting / System Administration"
author: "Emerson Bossi"
date: 2022
status: "archived"
topics: ["Windows 11", "Secure Boot", "UEFI", "MBR2GPT"]
content_type: "Troubleshooting Guide"
sidebar_label: "Windows 11 Troubleshooting"
sidebar_position: 1
slug: /secureboot-troubleshooting
---

# Troubleshooting: "This PC can't run Windows 11" (Secure Boot Error)

Windows 11 installation requires that users enable Trusted Platform Module [(TPM)](https://learn.microsoft.com/en-us/windows/security/hardware-security/tpm/trusted-platform-module-overview) and [Secure Boot](https://learn.microsoft.com/en-us/windows/security/operating-system-security/system-security/trusted-boot) before installing Windows 11.

:::note
This guide is about Secure Boot-related causes and does not cover TPM 2.0 configuration.
:::

:::warning
This was written in 2022. Instructions and information might be outdated.
:::

## Table of Contents

* [1. Issue Description](#1-issue-description)
* [2. Diagnostics: Checking System State](#2-diagnostics-checking-system-state)
* [3. Root Cause: Legacy Partition Styles](#3-root-cause-legacy-partition-styles)
* [4. MBR to GPT Partition Conversion](#4-mbr-to-gpt-partition-conversion)
* [5. Enabling Secure Boot in UEFI](#5-enabling-secure-boot-in-uefi)
* [6. Verification](#6-verification)

---

## 1. Issue Description

If the error message **"This PC doesn't meet the minimum system requirements."** shows when trying to update or install Windows 11, this might be a Secure Boot issue.

The error can be due to a disabled BIOS setting or an outdated partition style (**MBR**) that prevents UEFI features from working, which blocks Windows 11 from installing properly.

---

## 2. Diagnostics: Checking System State

Before making changes, verify whether or not the issue is related to  **Secure Boot.**

1. Select the **Start** button.

2. Type `System Information` on the search box.

3. Under the **Best match** menu, select **System Information**

4. At the top left of the **System Information** window, select **System Summary**.

5. Search for **Secure Boot State** on the **Item** column to the right.

6. Search for **BIOS Mode** on the **Item** column to the right.


:::note
**Logic Check:**
* If **Secure Boot State** is **On** and **BIOS Mode** is **UEFI**, the installation error is **not** related to Secure Boot. You should investigate TPM 2.0 or other hardware requirements.
* If **BIOS Mode** is **Legacy**, follow the disk conversion steps before attempting to enable Secure Boot.
* If **Secure Boot State** is **Off** and **BIOS Mode** is **UEFI**, follow the instructions below to enable it.
:::

```mermaid 
graph TD
    A[Start Diagnostics] --> B{BIOS Mode?}
    B -- Legacy --> C[Convert MBR to GPT]
    C --> D[Access BIOS/UEFI]
    B -- UEFI --> E{Secure Boot State?}
    E -- Off --> D
    E -- On --> F[Issue is not Secure Boot - Check TPM 2.0]
    D --> G[Enable Secure Boot]
    G --> H[Final Verification]
    H --> I[Ready for Windows 11]
 ```

---

## 3. Root Cause: Legacy Partition Styles

Before enabling **Secure Boot**, you need the correct partition style on your drive.

If  **BIOS Mode** is listed as **Legacy**, the disk is likely using the **MBR (Master Boot Record)** partition style.

Modern **Secure Boot** requires the **GPT (GUID Partition Table)** style. You must convert the disk before enabling **Secure Boot** in the BIOS.

---

## 4. MBR to GPT Partition Conversion

If **BIOS Mode** is set to **Legacy**, then convert your drive from **MBR** to **GPT**.

:::warning
Although the `mbr2gpt` tool is designed to preserve data, always **backup your files** before modifying partition structures.
:::

1. Navigate to **Settings > Update & Security > Recovery**.

2. Select **Restart now** under **Advanced startup**.

3. After rebooting, navigate to **Troubleshoot > Advanced options > Command Prompt**.

4. Run the validation command `mbr2gpt /validate`.

5. If the terminal returns `Validation completed successfully`, then run the conversion `mbr2gpt /convert`.

6. Type `exit` and press **Enter** to restart the system.

## 5. Enabling Secure Boot in UEFI

Once the current drive is set to GPT, proceed to enable **Secure Boot**.

:::warning
Enabling Secure Boot requires accessing the motherboard's BIOS/UEFI settings. Any incorrect configuration in this environment can prevent the system from booting. Do not change any settings other than those strictly mentioned in this guide unless you are an experienced user.
:::

1. Select the **Start** button.

2. Select **Settings**.

3. Navigate to **Update & Security > Recovery**.

4. Under **Advanced Startup**, select **Restart now**.

5. Select  **UEFI Firmware Settings**.

6. Select **Restart**.

The system should restart and open the BIOS. Once inside the BIOS:

1. Navigate to the **Security** or **Boot** tab.

2. Select **Secure Boot** and press **Enter**.

3. Select **Enabled** and press **Enter**.

4. Navigate to the **Exit** tab.

5. Select **Save Changes and Exit** and press **Enter** to reboot.

:::tip
You can also manually access the BIOS by pressing the BIOS key when booting up (e.g., **Delete**, **Esc**, **F10**, or **F12**). You can check your motherboard manual for the corresponding key if necessary.
:::

## 6. Verification

After the system reboots, repeat the diagnostic steps from [2. Diagnostics: Checking System State](#2-diagnostics-checking-system-state) to check if the information now matches the requirements.

| Requirement | Expected Value |
| :--- | :--- |
| **BIOS Mode** | UEFI |
| **Secure Boot State** | On |

If all values match the table, then the system is fully configured to support Windows 11 installation.