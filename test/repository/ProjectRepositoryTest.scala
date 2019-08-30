package repository

import anorm.SqlParser.scalar
import anorm._
import models.Project
import org.scalatest.BeforeAndAfterEach
import org.scalatestplus.play.PlaySpec
import org.scalatestplus.play.guice.GuiceOneServerPerSuite
import play.api.db.Database
import play.api.test.Injecting

class ProjectRepositoryTest extends PlaySpec with GuiceOneServerPerSuite with Injecting with BeforeAndAfterEach {

  val db = inject[Database]
  val projectRepository = inject[ProjectRepository]

  val project1 = Project("id1", "name1", "repositoryUrl1", "stableBranch1", Some("displayedBranches1"), Some("featuresRootPath1"), Some("documentationRootPath1"))
  val project2 = Project("id2", "name2", "repositoryUrl2", "stableBranch2", Some("displayedBranches2"), Some("featuresRootPath2"), Some("documentationRootPath2"))
  val project3 = Project("id3", "name3", "repositoryUrl3", "stableBranch3", Some("displayedBranches3"), Some("featuresRootPath3"), Some("documentationRootPath3"))

  val projects = Seq(project1, project2, project3)

  override def beforeEach() {
    db.withConnection { implicit connection =>

      projects.foreach { project =>
        SQL"""INSERT INTO project (id, name, repositoryUrl, stableBranch, displayedBranches, featuresRootPath, documentationRootPath)
           VALUES (${project.id}, ${project.name}, ${project.repositoryUrl},${project.stableBranch}, ${project.displayedBranches}, ${project.featuresRootPath}, ${project.documentationRootPath})"""
          .executeInsert()
      }
    }
  }

  override def afterEach() {
    db.withConnection { implicit connection =>
      SQL"TRUNCATE TABLE project".executeUpdate()
      SQL"TRUNCATE TABLE hierarchyNode".executeUpdate()
      SQL"TRUNCATE TABLE project_hierarchyNode".executeUpdate()
      SQL"TRUNCATE TABLE branch".executeUpdate()
    }
  }

  "ProjectRepository" should {
    "count the number of projects" in {
      projectRepository.count() mustBe 3
    }

    "delete a project" in {
      projectRepository.delete(project1)

      db.withConnection { implicit connection =>
        SQL"SELECT COUNT(*) FROM project WHERE id = ${project1.id}".as(scalar[Long].single) mustBe 0
      }
    }

    "delete a project by id" in {
      projectRepository.deleteById(project1.id)

      db.withConnection { implicit connection =>
        SQL"SELECT COUNT(*) FROM project WHERE id = ${project1.id}".as(scalar[Long].single) mustBe 0
      }

    }

    "delete all projects" in {
      projectRepository.deleteAll()

      db.withConnection { implicit connection =>
        SQL"SELECT COUNT(*) FROM project".as(scalar[Long].single) mustBe 0
      }
    }

    "delete all given projects" in {
      projectRepository.deleteAll(projects.tail)

      db.withConnection { implicit connection =>
        SQL"SELECT COUNT(*) FROM project".as(scalar[Long].single) mustBe 1
      }
    }

    "check if a project exist by id" in {
      projectRepository.existsById(project1.id) mustBe true
    }

    "find all projects" in {
      projectRepository.findAll() must contain theSameElementsAs projects
    }

    "find all projects by id" in {
      projectRepository.findAllById(projects.tail.map(_.id)) must contain theSameElementsAs projects.tail
    }

    "find a project by id" in {
      projectRepository.findById(project1.id) mustBe Some(project1)
    }

    "create a project" in {
      val project = Project("id4", "name4", "repositoryUrl4", "stableBranch4", Some("displayedBranches4"), Some("featuresRootPath4"), Some("documentationRootPath4"))
      projectRepository.save(project)

      projectRepository.findById(project.id) mustBe Some(project)
    }

    "update a project" in {
      val project = Project("id2", "name2bis", "repositoryUrl2bis", "stableBranch2bis", Some("displayedBranches2bis"), Some("featuresRootPath2bis"), Some("documentationRootPath2bis"))
      projectRepository.save(project)

      projectRepository.findById(project.id) mustBe Some(project)
    }

    "save all projects" in {
      val newProjects = Seq(Project("id2", "name2bis", "repositoryUrl2bis", "stableBranch2bis", Some("displayedBranches2bis"), Some("featuresRootPath2bis"), Some("documentationRootPath2bis")),
        Project("id4", "name4", "repositoryUrl4", "stableBranch4", Some("displayedBranches4"), Some("featuresRootPath4"), Some("documentationRootPath4")))

      projectRepository.saveAll(newProjects)

      projectRepository.findAll() must contain theSameElementsAs (newProjects :+ project1 :+ project3)
    }

    "find projects by hierarchyId" in {
      db.withConnection { implicit connection =>
        SQL"INSERT INTO hierarchyNode (id, slugName, name, childrenLabel, childLabel) VALUES ('id1', 'slugName1', 'name1', 'childrenLabel1', 'childLabel1')".executeInsert()
        SQL"INSERT INTO project_hierarchyNode (projectId, hierarchyId) VALUES ('id1', 'id1')".executeInsert()
        SQL"INSERT INTO project_hierarchyNode (projectId, hierarchyId) VALUES ('id1', 'id2')".executeInsert()
      }
      projectRepository.findAllByHierarchyId("id1") must contain theSameElementsAs Seq(project1)
    }

    "link a project to a hierarchy" in {
      db.withConnection { implicit connection =>
        SQL"INSERT INTO hierarchyNode (id, slugName, name, childrenLabel, childLabel) VALUES ('id1', 'slugName1', 'name1', 'childrenLabel1', 'childLabel1')".executeInsert()
      }
      projectRepository.linkHierarchy("id1", "id1") mustBe "id1"
    }

    "unlink a project to a hierarchy" in {
      db.withConnection { implicit connection =>
        SQL"INSERT INTO hierarchyNode (id, slugName, name, childrenLabel, childLabel) VALUES ('id1', 'slugName1', 'name1', 'childrenLabel1', 'childLabel1')".executeInsert()
        SQL"INSERT INTO project_hierarchyNode (projectId, hierarchyId) VALUES ('id1', 'id1')".executeInsert()
        projectRepository.unlinkHierarchy("id1", "id1")
        SQL"SELECT COUNT(*) FROM project_hierarchyNode where projectId = ${"id1"} AND hierarchyId = ${"id1"} ".as(scalar[Long].single) mustBe 0
      }
    }

    "check if a link exist by ids" in {
      db.withConnection { implicit connection =>
        SQL"INSERT INTO hierarchyNode (id, slugName, name, childrenLabel, childLabel) VALUES ('id1', 'slugName1', 'name1', 'childrenLabel1', 'childLabel1')".executeInsert()
        SQL"INSERT INTO project_hierarchyNode (projectId, hierarchyId) VALUES ('id1', 'id1')".executeInsert()
        projectRepository.existsLinkByIds("id1", "id1") mustBe true
      }
    }
  }
}
