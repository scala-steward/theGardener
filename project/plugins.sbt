// Comment to get more information during initialization
logLevel := Level.Warn

// Use the Play sbt plugin for Play projects
addSbtPlugin("com.typesafe.play" % "sbt-plugin" % "2.7.3")
addSbtPlugin("org.scoverage" % "sbt-scoverage" % "1.6.0-RC3")
addSbtPlugin("org.scalastyle" %% "scalastyle-sbt-plugin" % "1.0.0")
addSbtPlugin("com.sksamuel.scapegoat" %% "sbt-scapegoat" % "1.0.9")
addSbtPlugin("net.virtual-void" % "sbt-dependency-graph" % "0.9.2")
addSbtPlugin("org.jmotor.sbt" % "sbt-dependency-updates" % "1.2.0")

addSbtPlugin("com.kelkoo.common.sbt" % "sbt-angular-cli" % "0.1.6")

evictionWarningOptions in update := EvictionWarningOptions.empty