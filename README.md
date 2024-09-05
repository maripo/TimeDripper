# TimeDripper

This Firefox extension helps you manage your time more effectively by blocking access to specified websites. 
The time limit for site access gradually recovers at a set pace.

## Concept

TimeDripper is designed to reduce psychological stress and facilitate effortless self-control.

Traditional browsing restriction tools typically limit usage to a fixed number of minutes per day. This often leads users to overly focus on how much daily browsing time they have left, which can be counterproductive. If one inadvertently uses up their allotted time, being blocked until the end of the day can feel excessively punitive. This may lead to users discontinuing the use of the tool or abandoning it altogether.

In contrast, TimeDripper’s gradual recovery of browsing time alleviates these concerns. After a short time, the resting time will be recharged again. It operates similarly to the stamina systems found in social games, where resources slowly replenish over time, making it less likely for users to feel restricted or penalized.

We hope you will use it in a positive and relaxed way, like taking the time to brew a cup of coffee.

## Install

This extension can be installed from the Mozilla site.
https://addons.mozilla.org/en-US/firefox/addon/timedripper/

## How to install the development version

From this GitHub repository, you can install the development version.

1. Download the latest release from this repository.
2. Open Firefox and navigate to `about:addons`.
3. Click on the gear icon, then choose 'Install Add-on From File'.
4. Select `extension/manifest.json`　and accept the installation prompt.

## Manual
* We recommend pinning the TimeDripper icon to your Firefox toolbar for easy access. This allows you to quickly check your remaining time at a glance.
* Clicking the TimeDripper icon opens a popup where you can manage various settings:

  * Sites Tab: Configure Blocked and Allowed Sites: Here, you can add website you want to restrict access to or allow specific sites. You can use wildcards in URLs for more flexible control.

  * Settings Tab: 
    * Manage Time Limits: Customize the maximum amount of time, the frequency of recovery, and the amount of time recovered at once. This allows you to finely tune TimeDripper according to your usage. 
    * Badge Display Settings: Choose whether to display the remaining time as a badge on the TimeDripper icon. This helps you keep track of time even while browsing.
    
## License
This project is licensed under the MIT License - see the LICENSE.md file for details.

## Contact and Collaboration
We welcome your feedback and contributions! Please feel free to raise issues on GitHub or contact us through Twitter for any suggestions or enhancements.
